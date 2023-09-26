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
		version: "",
		client_name: "",
		project_name: "",
		project_description: ""
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
					<Input required={true} onChange={handleChange} value={formState.date} id={"date"} label={"Date for quotation"} placeholder={"Enter the date"} />
					<Input required={true} onChange={handleChange} value={formState.version} id={"version"} label={"Version"} placeholder={"Eg. 1.0"} />
					<Input required={true} onChange={handleChange} value={formState.client_name} id={"client_name"} label={"Client Name"} placeholder={"Enter Client name"} />
					<Input required={true} onChange={handleChange} value={formState.project_name} id={"project_name"} label={"Project Name"} placeholder={"Enter project name"} />
					<Input required={true} onChange={handleChange} value={formState?.delivery_date} id={"delivery_date"} label={"Delivery Date"} placeholder={"Enter delivery date"} />
					<Input required={true} onChange={handleChange} value={formState.project_description} id={"project_description"} label={"Project Description"} placeholder={"Enter project description"} />
					<Button type={"submit"} loading={loading} text={"Save"} />
				</form>

				<main className={fullscreen ? 'relative w-screen min-h-screen flex flex-col' : 'relative w-[50vw] min-h-screen flex flex-col overflow-auto'}>
					<div ref={buttonBar} className={fullscreen ? 'cursor-pointer z-50 fixed bottom-3 w-screen flex justify-center gap-3' : 'gap-3 cursor-pointer z-50 fixed bottom-3 w-[50vw] flex justify-center'}>
						<span onClick={() => { setFullscreen(!fullscreen) }} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>{fullscreen ? "Exit Full Screen" : "Full Screen"}</span>
						{fullscreen && <span onClick={() => {
							window.print()
						}} className='text-white bg-gray-800 px-5 py-2 rounded-lg text-sm w-40 text-center'>Print</span>}
					</div>
					<section className='px-20 py-10 w-full min-h-screen bg-white flex flex-col justify-around border-b-2'>
						<img className='w-40 mx-auto' src="/logo-1.png" alt="" />
						<h1 className='text-center text-4xl font-bold'>{"Software Development Agreement"}</h1>
						<div className='flex flex-col gap-4'>
							<div className='w-full flex flex-col'>
								<b>Prepared For:</b>
								<p>{formState?.client_name}</p>
							</div>
							<div className='w-full flex flex-col'>
								<b>Prepared By:</b>
								<p>{"Connectia Technologies"}</p>
							</div>
						</div>
						{/* <h1 className='text-center text-3xl font-bold uppercase'>Client Name: {formState?.client_name}</h1>
						<div className='flex flex-col items-center justify-center'>
							<h2 className='text-2xl font-bold'>Project Plan</h2>
							<h4 className='font-bold'>Version {formState?.version}</h4>
							<h4 className='font-bold'>{formState.date}</h4>
						</div>
						<h1 className='text-center text-2xl font-bold'>Submitted By: Connectia Solutions</h1> */}
					</section>
					<section className='px-10 py-10 w-full min-h-screen bg-white flex flex-col gap-y-3'>
						<p>This Software Development Agreement states the terms and conditions that govern the contractual agreement between <b>Connectia Technologies</b> having his principal place of business at 200 Clock Tower Pl Carmel, California(CA), 93923, (the “Developer”), and {formState.client_name} having its principal place of business at 200 Gainsborough Cir Folsom, California(CA), 95630 (the “Client”) who agrees to be bound by this Agreement.
							<br /><b>WHEREAS</b>, the Client has conceptualized [QUICK DESCRIPTION OF SOFTWARE] {formState.project_name}, which is described in further detail on Exhibit A, and the Developer is a contractor with whom the Client has come to an agreement to develop the Software.
							<br /><b>NOW, THEREFORE</b>, In consideration of the mutual covenants and promises made by the parties to this Software Development Agreement, the Developer and the Client (individually, each a “Party” and collectively, the “Parties”) covenant and agree as follows:</p>
						<h2 className='text-2xl font-bold mt-5'>1. Developer Duties</h2>
						<p>The Client hereby engages the Developer and the Developer hereby agrees to be engaged by the Client to develop the Software in accordance with the specifications attached hereto as Exhibit A (the “Specifications”).</p>
						<ul className='pl-3'>
							<li className='flex gap-4'>
								<span>1.</span>
								<span>The Developer shall complete the development of the Software according to the milestones described on the form attached hereto as Exhibit B. In accordance with such milestones, the final product shall be delivered to the Client by {formState?.delivery_date}.</span>
							</li>
							<li className='flex gap-4'>
								<span>2.</span>
								<span>For a period of 20 days after delivery of the final product, the Developer shall provide the Client attention to answer any questions or assist solving any problems with regard to the operation of the Software up to 90 of hours free of charge and billed to the Client at a rate of $40 per hour for any assistance thereafter. The Developer agrees to respond to any reasonable request for assistance made by the Client regarding the Software within 30 days of the request.</span>
							</li>
							<li className='flex gap-4'>
								<span>3.</span>
								<span>Except as expressly provided in this Software Development Agreement, the Client shall not be obligated under this Agreement to provide any other support or assistance to the Developer.</span>
							</li>
							<li className='flex gap-4'>
								<span>4.</span>
								<span>The Client may terminate this Software Development Agreement at any time upon material breach of the terms herein and failure to cure such a breach within 20 days of notification of such a breach.</span>
							</li>
							<li className='flex gap-4'>
								<span>5.</span>
								<span>The Developer shall provide to the Client after the Delivery Date, a cumulative 2 days of training with respect to the operation of the Software if requested by the Client.</span>
							</li>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>2. Delivery</h2>
						<p>The Software shall function in accordance with the Specifications on or before the Delivery Date.</p>
						<ul className='pl-3'>
							<li className='flex gap-4'>
								<span>1.</span>
								<span>If the Software as delivered does not conform with the Specifications, the Client shall within 30 days of the Delivery Date notify the Developer in writing of the ways in which it does not conform with the Specifications. The Developer agrees that upon receiving such notice, it shall make reasonable efforts to correct any non-conformity.</span>
							</li>
							<li className='flex gap-4'>
								<span>2.</span>
								<span>The Client shall provide to the Developer written notice of its finding that the Software conforms to the Specifications within 20 days of the Delivery Date (the “Acceptance Date”) unless it finds that the Software does not conform to the Specifications as described in Section 2(A) herein.</span>
							</li>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>3. Compensation</h2>
						<p>The Software shall function in accordance with the Specifications on or before the Delivery Date.</p>
						<ul className='pl-3'>
							<p>Compensation. In consideration for the Service, the Client shall pay the Company at the rate of $20 per hour (the “Hourly Rate”), with a maximum total fee for all work under this Software Development Agreement of $50.000. Fees billed under the Hourly Rate shall be due and payable upon the Developer providing the Client with an invoice. Invoices will be provided for work completed by the developer once every 30 days.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>4. Intellectual property rights in the software</h2>
						<p>The Software shall function in accordance with the Specifications on or before the Delivery Date.</p>
						<ul className='pl-3'>
							<p>The Parties acknowledge and agree that the Client will hold all intellectual property rights in the Software including, but not limited to, copyright and trademark rights. The Developer agrees not to claim any such ownership in the Software's intellectual property at any time prior to or after the completion and delivery of the Software to the Client.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>5. Change in specifications</h2>
						<p>The Software shall function in accordance with the Specifications on or before the Delivery Date.</p>
						<ul className='pl-3 flex flex-col gap-2'>
							<p>The Client may request that reasonable changes be made to the Specifications and tasks associated with the implementation of the Specifications. If the Client requests such a change, the Developer will use its best efforts to implement the requested change at no additional expense to the Client and without delaying delivery of the Software.</p>
							<p>	In the event that the proposed change will, in the sole discretion of the Developer, require a delay in the delivery of the Software or would result in additional expense to the Client, then the Client and the Developer shall confer and the Client may either withdraw the proposed change or require the Developer to deliver the Software with the proposed change and subject to the delay and/or additional expense. The Client agrees and acknowledges that the judgment as to if there will be any delay or additional expense shall be made solely by the Developer.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>6. Confidentiality</h2>
						<p>The Software shall function in accordance with the Specifications on or before the Delivery Date.</p>
						<ul className='pl-3 flex flex-col gap-2'>
							<p>The Developer shall not disclose to any third party the business of the Client, details regarding the Software, including, without limitation any information regarding the Software’s code, the Specifications, or the Client’s business (the “Confidential Information”), (ii) make copies of any Confidential Information or any content based on the concepts contained within the Confidential Information for personal use or for distribution unless requested to do so by the Client, or (iii) use Confidential Information other than solely for the benefit of the Client.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>7. Developer warranties</h2>
						<p>The Developer represents and warrants to the Client the following:</p>
						<ul className='pl-3 flex flex-col gap-2'>
							<li className='flex gap-4'>
								<span>1.</span>
								<span>Development and delivery of the Software under this Agreement are not in violation of any other agreement that the Developer has with another party.</span>
							</li>
							<li className='flex gap-4'>
								<span>2.</span>
								<span>The Software will not violate the intellectual property rights of any other party.</span>
							</li>
							<li className='flex gap-4'>
								<span>3.</span>
								<span>For a period of 10 days after the Delivery Date, the Software shall operate according to the Specifications. If the Software malfunctions or in any way does not operate according to the Specifications within that time, then the Developer shall take any reasonably necessary steps to fix the issue and ensure the Software operates according to the Specifications.</span>
							</li>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>8. Indemnification</h2>
						<ul className='pl-3 flex flex-col gap-2'>
							<p>The Developer agrees to indemnify, defend, and protect the Client from and against all lawsuits and costs of every kind pertaining to the software including reasonable legal fees due to the Developer's infringement of the intellectual rights of any third party.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>9. No modification unless in writing</h2>
						<ul className='pl-3 flex flex-col gap-2'>
							<p>No modification of this Agreement shall be valid unless in writing and agreed upon by both Parties.</p>
						</ul>
						<h2 className='text-2xl font-bold mt-5'>10. Applicable law</h2>
						<ul className='pl-3 flex flex-col gap-2'>
							<p>This Software Development Agreement and the interpretation of its terms shall be governed by and construed in accordance with the laws of the State of California and subject to the exclusive jurisdiction of the federal and state courts located in Alpine, California.</p>
						</ul>
					</section>
				</main>
			</main>
		</>
	)
}

export default SecondFormat