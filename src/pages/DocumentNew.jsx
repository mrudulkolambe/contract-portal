import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button';
import { useRef } from 'react';
import { db } from '../config/firebase_config';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';

const SecondFormat = () => {
	const buttonBar = useRef();
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			const unsub = onSnapshot(doc(db, "contracts", id), (doc) => {
				setFormState(doc.data())
			});
			return () => {
				unsub()
			};
		}
	}, [id]);

	const initialFormState = {
		date: "",
		companyBName: "",
		companyBAddress: "",
		amount: "",
		startDate: "",
		endDate: "",
	}

	const [formState, setFormState] = useState(initialFormState);
	const [fullscreen, setFullscreen] = useState(false)
	const navigate = useNavigate()
	const handleChange = (e) => {
		setFormState({
			...formState,
			[e.target.id]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		if (!id) {
			addDoc(collection(db, "contracts"), formState)
				.then((document) => {
					setLoading(false)
					navigate(`/contracts`)
				})
				.catch((err) => {
					setLoading(false)
					alert(err.message)
				})
		} else {
			const docRef = doc(db, "contracts", id);
			updateDoc(docRef, formState)
				.then((doc) => {
					setLoading(false)
				})
				.catch((err) => {
					setLoading(false)
					alert(err.message)
				})
		}
	}

	useEffect(() => {
		window.addEventListener("beforeprint", () => {
			buttonBar.current.style.display = "none";
		})
		window.addEventListener("afterprint", () => {
			buttonBar.current.style.display = "flex";
		})
		return () => {
			window.removeEventListener("beforeprint", () => {
				buttonBar.current.style.display = "none";
			})
			window.removeEventListener("afterprint", () => {
				buttonBar.current.style.display = "flex";
			})
		};
	}, []);
	return (
		<>
			<main key={id} className='h-screen max-w-full w-full flex'>
				<form onSubmit={handleSubmit} className={fullscreen ? 'hidden' : 'w-[50vw] h-screen border-r px-20 py-10 bg-gray-100 flex flex-col gap-3'}>
					<nav className='flex gap-3'>
						<a className='font-semibold' href={"/create"}>Draft-1</a>
						<a className='text-blue-500 font-semibold' href={"/draft-2"}>Draft-2</a>
						<Link className='font-semibold' to={"/contracts"}>Contracts</Link>
					</nav>
					<h1 className='text-2xl font-bold text-center mb-4'>Form</h1>
					<Input required={true} onChange={handleChange} value={formState?.date} id={"date"} label={"Date for quotation"} placeholder={"Enter the date"} />
					<Input required={true} onChange={handleChange} value={formState?.companyBName} id={"companyBName"} label={"Company B Name"} placeholder={"Enter Company B Name"} />
					<Input required={true} onChange={handleChange} value={formState?.companyBAddress} id={"companyBAddress"} label={"Company B Address"} placeholder={"Enter Company B Address"} />
					<Input required={true} onChange={handleChange} value={formState?.amount} id={"amount"} label={"Amount"} placeholder={"Enter Amount"} />
					<Input required={true} onChange={handleChange} value={formState?.startDate} id={"startDate"} label={"Start Date"} placeholder={"Enter Start Date"} />
					<Input required={true} onChange={handleChange} value={formState?.endDate} id={"endDate"} label={"End Date"} placeholder={"Enter End Date"} />
					{/* <Input required={true} onChange={handleChange} value={formState?.project_name} id={"project_name"} label={"Project Name"} placeholder={"Enter project name"} /> */}
					<Button type={"submit"} loading={loading} text={"Save"} />
				</form>

				<main className={fullscreen ? 'relative w-screen min-h-screen flex flex-col' : 'relative w-[50vw] min-h-screen flex flex-col overflow-auto'}>
					<div ref={buttonBar} className={fullscreen ? 'cursor-pointer z-50 fixed bottom-3 w-screen flex justify-center gap-3' : 'gap-3 cursor-pointer z-50 fixed bottom-3 w-[50vw] flex justify-center'}>
						<span onClick={() => { setFullscreen(!fullscreen) }} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>{fullscreen ? "Exit Full Screen" : "Full Screen"}</span>
						{fullscreen && <span onClick={() => {
							window.print()
						}} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>Print</span>}
					</div>
					<section className='text-right px-20 py-10 w-full min-h-screen bg-white flex flex-col border-b-2'>
						<h1>عقد نموذجي بين شركتين - اتفاق لمدة سنة واحدة</h1>
						<h1>تمت هذه العقد ("العقد") في تاريخ [{formState?.date}]، (بما فيها تاريخ السريان)، بين:</h1>


						<h1>الشركة أ</h1>

						<h1>- الاسم: {"DSolutions"}</h1>
						<h1>- العنوان: [{"DSolutions Address"}]</h1>


						<h1>الشركة ب</h1>

						<h1>- الاسم: [{formState?.companyBName}]</h1>
						<h1>- العنوان: [{formState?.companyBAddress}]</h1>
					</section>
					<section className='text-right px-10 py-6 w-full min-h-screen bg-white flex flex-col gap-y-3'>

						<p>(المشار إليها جميعًا باسم "الأطراف").</p>

						<h2 className='text-lg mt-4 font-bold'>1. نطاق العمل</h2>
						<p className='text-base'>تتفق الشركة أ على تقديم المنتجات / الخدمات التالية للشركة ب:</p>
						<p className='mt-2'>[وصف مفصل للمنتجات / الخدمات التي يتم تقديمها، بما في ذلك التسليمات والمراحل الزمنية وأية متطلبات محددة.]</p>


						<h2 className='text-lg mt-6 font-bold'>2. المدة</h2>
						<p className='text-base'>تتفق الشركة أ على تقديم المنتجات / الخدمات التالية للشركة ب:</p>
						<p className='mt-2'>سيبدأ هذا العقد في التاريخ الفعّال وسيستمر بكامل قوته وفعاليته لمدة سنة واحدة (المدة)، ما لم يتم إنهاؤه مسبقًا وفقًا للأحكام المحددة في القسم 5 (الإنهاء).</p>


						<h2 className='text-lg mt-6 font-bold'>3. الدفع</h2>
						<p className='text-base'>تتفق الشركة أ على تقديم المنتجات / الخدمات التالية للشركة ب:</p>
						<p className='mt-2'>تتفق الشركة ب على دفع الشركة أ مقابل المنتجات / الخدمات المقدمة على النحو التالي:</p>
						<p className='mt-2'>- المبلغ المستحق: [{formState?.amount}]</p>
						<p className='mt-2'>- جدول الدفع: [حدد جدول الدفع، مثل شهريًا أو ربع سنويًا، أو حسب الاتفاق الآخر]</p>
						<p className='mt-2'>- طريقة الدفع: [حدد طريقة الدفع، مثل التحويل البنكي، الشيك، أو طرق أخرى]</p>


						<h2 className='text-lg mt-6 font-bold'>4. الملكية الفكرية</h2>
						<p className='text-base'>أي ملكية فكرية، بما في ذلك ولكن دون اقتصار البراءات، وحقوق النشر، والعلامات التجارية، أو أسرار التجارة، التي</p>
						<p className='mt-2'> تم تطويرها أو استخدامها أثناء أداء هذا العقد ستكون ملكًا لصاحبها وفقًا للقوانين المعمول بها وأي اتفاقات منفصلة.</p>


						<h2 className='text-lg mt-6 font-bold'>5. الإنهاء</h2>
						<p className='text-base'>يمكن لإحدى الأطراف إنهاء هذا العقد بإشعار كتابي إلى الطرف الآخر إذا:</p>
						<p className='mt-2'>- حدث انتهاك جوهري لهذا العقد، وفشل الطرف المنتهك في تصحيح الانتهاك في غضون [حدد فترة معقولة] أيام بعد تلقيه إشعارًا كتابيًا بالانتهاك.</p>
						<p className='mt-2'>- أصبحت إحدى الأطراف عجزاً مالياً أو قدمت طلباً للإفلاس.</p>
					</section>
					<section className='text-right px-10 py-6 w-full min-h-screen bg-white flex flex-col gap-y-3'>
						<h2 className='text-lg font-bold'>6. السرية</h2>
						<p className='text-base'>تتفق الأطراف على الحفاظ على سرية أي معلومات أو بيانات أو مواد تم الكشف عنها خلال مدة هذا العقد وعدم الكشف عن مثل هذه المعلومات لأطراف ثالثة دون موافقة كتابية من الطرف الآخر.</p>


						<h2 className='text-lg mt-6 font-bold'>7. القانون الساري</h2>
						<p className='text-base'>سيكون هذا العقد خاضعًا للقوانين والأنظمة السارية في [حدد الولاية القانونية المعنية].</p>


						<h2 className='text-lg mt-6 font-bold'>8. الاتفاق الكامل</h2>
						<p className='text-base'>يشكل هذا العقد الاتفاق الكامل بين الأطراف ويحل محل جميع الاتفاقيات والفهم والتمثيلات السابقة، سواء كانت شفهية أو مكتوبة.</p>


						<h2 className='text-lg mt-6 font-bold'>9. التعديل</h2>
						<p className='text-base'>يجب أن يكون أي تعديل على هذا العقد كتابيًا وموقعًا من قبل الأطرافين.</p>


						<h2 className='text-lg mt-6 font-bold'>10. نسخ متطابقة</h2>
						<p className='text-base'>يمكن تنفيذ هذا العقد في نسخ متطابقة، وسيعتبر كل منها نسخة أصلية ولكنها ستشكل معًا وثيقة واحدة ونفسها.</p>


						<p className='mt-7 text-base'>بشهادة هذا، قامت الأطراف بهذا العقد اعتبارًا من التاريخ الفعّال.</p>


						<p className='mt-7 text-base font-bold'>الشركة .</p>
						<p className=' text-base'>[التوقيع]</p>
						<p className=' text-base'>[اسم الموقع]</p>
						<p className=' text-base'>[المسمى الوظيفي]</p>
						<p className=' text-base'>[التاريخ]</p>

						<p className='mt-7 text-base font-bold'>الشركة </p>
						<p className=' text-base'>[التوقيع]</p>
						<p className=' text-base'>[اسم الموقع]</p>
						<p className=' text-base'>[المسمى الوظيفي]</p>
						<p className=' text-base'>[التاريخ]</p>
					</section>
				</main>
			</main >
		</>
	)
}

export default SecondFormat