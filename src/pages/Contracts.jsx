import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UseDataContext } from '../context/data'
import Input from '../components/Input'

const Contracts = () => {
	const { contracts } = UseDataContext();
	const [searchResults, setSearchResults] = useState([])

	useEffect(() => {
		setSearchResults(contracts)
	}, [contracts]);

	const handleSearch = (e) => {
		if (e.target.value?.length === 0) {
			setSearchResults(contracts)
		} else {
			setSearchResults(
				contracts?.filter((contract) => {
					return contract?.id?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || contract?.client_name?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || contract?.project_name?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || contract?.project_description?.toLowerCase()?.includes(e.target.value?.toLowerCase()) || contract?.date?.toLowerCase()?.includes(e.target.value?.toLowerCase())
				})
			)
		}
	}
	return (
		<main className='px-20 py-10 flex flex-col'>
			<nav className='flex gap-3'>
				<a className='font-semibold' href={"/create"}>Create Document</a>
				<Link className='text-blue-500 font-semibold' to={"/contracts"}>Contracts</Link>
			</nav>
			<h1 className='text-3xl font-bold mb-3 mt-10'>Contracts</h1>
			<Input onChange={handleSearch} placeholder={"Search..."} />
			<section className='mt-3 flex flex-col gap-y-4'>
				{
					searchResults?.map((contract) => {
						return <Link to={`/contract/${contract?.id}`} key={contract?.id} className='bg-gray-100 rounded-lg px-5 py-4'>
							<div className='flex justify-between'>
								<p className='font-bold'>Project: {contract?.project_name} (v{contract?.version})</p>
								<p>Date: {contract?.date}</p>
							</div>
							<p>Client: {contract?.client_name}</p>
						</Link>
					})
				}
			</section>
		</main>
	)
}

export default Contracts
