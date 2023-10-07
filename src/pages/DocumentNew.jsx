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
			<main key={id} className='w-full flex'>
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

				<main className={fullscreen ? 'relative w-screen flex flex-col overflow-y-hidden' : 'relative w-[50vw] flex flex-col overflow-y-hidden'}>
					<div ref={buttonBar} className={fullscreen ? 'cursor-pointer z-50 fixed bottom-3 w-screen flex justify-center gap-3' : 'gap-3 cursor-pointer z-50 fixed bottom-3 w-[50vw] flex justify-center'}>
						<span onClick={() => { setFullscreen(!fullscreen) }} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>{fullscreen ? "Exit Full Screen" : "Full Screen"}</span>
						{fullscreen && <span onClick={() => {
							window.print()
						}} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>Print</span>}
					</div>


					<div className='flex max-h-screen '>
						<div className='flex flex-col w-[50vw] border-r h-screen'>
							<section className={fullscreen ? 'px-10 py-10 w-full min-h-screen bg-white flex flex-col' : 'px-10 py-10 w-full min-h-screen bg-white flex flex-col'}>
								<h1>Sample Contract Between Two Companies - 1-Year Agreement</h1>
								<h1>This Contract ("Contract") is entered into as of [{formState.date}], (the "Effective Date"), by and between:</h1>
								<h1 className='mt-6 font-semibold'>Company A</h1>
								<h1>- Name: {"DSolutions"}</h1>
								<h1>- Address: [{"DSolutions Address"}]</h1>
								<h1 className='mt-6 font-semibold'>Company B</h1>
								<h1>- Name: [{formState?.companyBName}]</h1>
								<h1>- Address: [{formState?.companyBAddress}]</h1>
							</section>
						</div>
						<div className='flex flex-col w-[50vw] border-l h-screen'>
							<section className={fullscreen ? 'text-right px-10 py-10 w-full min-h-screen bg-white flex flex-col' : 'text-right px-10 py-10 w-full min-h-screen bg-white flex flex-col'}>
								<h1>عقد نموذجي بين شركتين - اتفاق لمدة سنة واحدة</h1>
								<h1>تمت هذه العقد ("العقد") في تاريخ [{formState?.date}]، (بما فيها تاريخ السريان)، بين:</h1>
								<h1 className='mt-6 font-semibold'>الشركة أ</h1>
								<h1>- الاسم: {"DSolutions"}</h1>
								<h1>- العنوان: [{"DSolutions Address"}]</h1>
								<h1 className='mt-6 font-semibold'>الشركة ب</h1>
								<h1>- الاسم: [{formState?.companyBName}]</h1>
								<h1>- العنوان: [{formState?.companyBAddress}]</h1>
							</section>
						</div>
					</div>

					<div className='flex'>
						<div className='flex flex-col w-[50vw] border-r'>
							<section className='px-10 py-6 w-full min-h-screen bg-white flex flex-col gap-y-3'>
								<p>(collectively referred to as the "Parties").</p>
								<h2 className='text-lg mt-4 font-bold'>1. Scope of Work</h2>
								<p className='text-base'>Company A agrees to provide the following products/services to Company B:</p>
								<p className='mt-2'>[Detailed description of the products/services being provided, including deliverables, milestones, and any specific requirements.]</p>


								<h2 className='text-lg mt-6 font-bold'>2. Term</h2>
								<p className='text-base'>This Contract shall commence on the Effective Date and continue in full force and effect for a period of one (1) year (the "Term"), unless terminated earlier as per the terms specified in Section 5 (Termination).</p>

								<h2 className='text-lg mt-6 font-bold'>3. Payment</h2>
								<p className='text-base'>Company B agrees to pay Company A for the products/services provided as follows:</p>
								<p className='mt-2'>- Payment Amount: [Specify the payment amount]:</p>
								<p className='mt-2'>- Payment Schedule: [Specify the payment schedule, e.g., monthly, quarterly, or as otherwise agreed upon]</p>
								<p className='mt-2'>- Payment Method: [Specify the payment method, e.g., bank transfer, check, or other methods]</p>

								<h2 className='text-lg mt-6 font-bold'>4. Intellectual Property</h2>
								<p className='text-base'>Any intellectual property, including but not limited to patents, copyrights, trademarks, or trade secrets, developed or utilized during the performance of this Contract shall belong to the respective owner as determined by applicable laws and any separate agreements.</p>

								<h2 className='text-lg mt-6 font-bold'>5. Termination</h2>
								<p className='text-base'>Either party may terminate this Contract with written notice to the other party if:</p>
								<p className='mt-2'>- A material breach of this Contract occurs, and the breaching party fails to remedy the breach within [Specify a reasonable period] days after receiving written notice of the breach.</p>
								<p className='mt-2'>- Either party becomes insolvent or files for bankruptcy.</p>

								<h2 className='text-lg font-bold'>6. Confidentiality</h2>
								<p className='text-base'>Both parties agree to maintain the confidentiality of any information, data, or materials disclosed during the term of this Contract, and not to disclose such information to third parties without the written consent of the other party.</p>

								<h2 className='text-lg mt-6 font-bold'>7. Governing Law</h2>
								<p className='text-base'>This Contract shall be governed by and construed in accordance with the laws of [Specify the governing jurisdiction].</p>

								<h2 className='text-lg mt-6 font-bold'>8. Entire Agreement</h2>
								<p className='text-base'>This Contract constitutes the entire agreement between the Parties and supersedes all prior agreements, understandings, and representations, whether oral or written.</p>

								<h2 className='text-lg mt-6 font-bold'>9. Amendment</h2>
								<p className='text-base'>Any modification to this Contract shall be in writing and signed by both Parties.</p>

								<h2 className='text-lg mt-6 font-bold'>10. Counterparts</h2>
								<p className='text-base'>This Contract may be executed in counterparts, each of which shall be deemed an original but all of which together shall constitute one and the same instrument.</p>
								<p className='mt-7 text-base'>IN WITNESS WHEREOF, the Parties hereto have executed this Contract as of the Effective Date.</p>


								<p className='mt-7 text-base font-bold'>Company A .</p>
								<p className=' text-base'>[Signature]</p>
								<p className=' text-base'>[Name of Signatory]</p>
								<p className=' text-base'>[Title]</p>
								<p className=' text-base'>[Date]</p>


								<p className='mt-7 text-base font-bold'>Company B .</p>
								<p className=' text-base'>[Signature]</p>
								<p className=' text-base'>[Name of Signatory]</p>
								<p className=' text-base'>[Title]</p>
								<p className=' text-base'>[Date]</p>
							</section>
						</div>

						<div className='flex flex-col w-[50vw] border-r'>
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
						</div>
					</div>




					

					<div className='hidden max-h-screen'>
						<div className='flex flex-col w-[50vw] border-r h-screen'>
							<section className='px-10 py-6 w-full min-h-screen bg-white flex flex-col gap-y-3'>
								<h2 className='text-lg font-bold'>6. Confidentiality</h2>
								<p className='text-base'>Both parties agree to maintain the confidentiality of any information, data, or materials disclosed during the term of this Contract, and not to disclose such information to third parties without the written consent of the other party.</p>

								<h2 className='text-lg mt-6 font-bold'>7. Governing Law</h2>
								<p className='text-base'>This Contract shall be governed by and construed in accordance with the laws of [Specify the governing jurisdiction].</p>

								<h2 className='text-lg mt-6 font-bold'>8. Entire Agreement</h2>
								<p className='text-base'>This Contract constitutes the entire agreement between the Parties and supersedes all prior agreements, understandings, and representations, whether oral or written.</p>

								<h2 className='text-lg mt-6 font-bold'>9. Amendment</h2>
								<p className='text-base'>Any modification to this Contract shall be in writing and signed by both Parties.</p>

								<h2 className='text-lg mt-6 font-bold'>10. Counterparts</h2>
								<p className='text-base'>This Contract may be executed in counterparts, each of which shall be deemed an original but all of which together shall constitute one and the same instrument.</p>
								<p className='mt-7 text-base'>IN WITNESS WHEREOF, the Parties hereto have executed this Contract as of the Effective Date.</p>


								<p className='mt-7 text-base font-bold'>Company A .</p>
								<p className=' text-base'>[Signature]</p>
								<p className=' text-base'>[Name of Signatory]</p>
								<p className=' text-base'>[Title]</p>
								<p className=' text-base'>[Date]</p>


								<p className='mt-7 text-base font-bold'>Company B .</p>
								<p className=' text-base'>[Signature]</p>
								<p className=' text-base'>[Name of Signatory]</p>
								<p className=' text-base'>[Title]</p>
								<p className=' text-base'>[Date]</p>
							</section>
						</div>
						<div className='flex flex-col w-[50vw] border-l h-screen'>
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
						</div>
					</div>

				</main>
			</main >
		</>
	)
}

export default SecondFormat