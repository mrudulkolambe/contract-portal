import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button';
import { useRef } from 'react';
import { db } from '../config/firebase_config';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Document = () => {
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
					navigate(`/contract/${document.id}`)
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
						<a className='text-blue-500 font-semibold' href={"/create"}>Create Document</a>
						<Link className='font-semibold' to={"/contracts"}>Contracts</Link>
					</nav>
					<h1 className='text-2xl font-bold text-center mb-4'>Form</h1>
					<Input required={true} onChange={handleChange} value={formState.date} id={"date"} label={"Date for quotation"} placeholder={"Enter the date"} />
					<Input required={true} onChange={handleChange} value={formState.version} id={"version"} label={"Version"} placeholder={"Eg. 1.0"} />
					<Input required={true} onChange={handleChange} value={formState.client_name} id={"client_name"} label={"Client Name"} placeholder={"Enter Client name"} />
					<Input required={true} onChange={handleChange} value={formState.project_name} id={"project_name"} label={"Project Name"} placeholder={"Enter project name"} />
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
						<h1 className='text-center text-4xl font-bold'>{formState?.project_name}</h1>
						<h1 className='text-center text-3xl font-bold uppercase'>Client Name: {formState?.client_name}</h1>
						<div className='flex flex-col items-center justify-center'>
							<h2 className='text-2xl font-bold'>Project Plan</h2>
							<h4 className='font-bold'>Version {formState?.version}</h4>
							<h4 className='font-bold'>{formState.date}</h4>
						</div>
						<h1 className='text-center text-2xl font-bold'>Submitted By: Connectia Solutions</h1>
					</section>
					<section className='px-10 py-10 w-full min-h-screen bg-white flex flex-col border-b-2 gap-y-3'>
						<h2 className='text-xl font-bold uppercase text-center'>Document Release note</h2>
						<h2 className='text-xl font-bold mt-8'>Client: {formState?.client_name}</h2>
						<h2 className='mt-4'><span className='font-bold'>Project</span>: {formState?.project_description}</h2>
						<h2 className='mt-4 font-bold'>Document Details:</h2>

						<div class="relative overflow-x-auto">
							<table class="border w-full text-sm text-left text-gray-500">
								<thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
									<tr>
										<th scope="col" class="px-6 py-4">
											Name
										</th>
										<th scope="col" class="px-6 py-4">
											Version No.
										</th>
										<th scope="col" class="px-6 py-4">
											Description
										</th>
									</tr>
								</thead>
								<tbody>
									<tr class="bg-white border-b">
										<th scope="row" class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
											Apple MacBook Pro 17"
										</th>
										<td class="px-6 py-3">
											Silver
										</td>
										<td class="px-6 py-3">
											Laptop
										</td>
									</tr>
								</tbody>
							</table>
						</div>

					</section>
				</main>
			</main>
		</>
	)
}

export default Document