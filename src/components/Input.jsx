import React from 'react'

const Input = ({id, label, type, value, onChange, placeholder, required=false}) => {
  return (
	<div className='flex flex-col'>
	  {label && <label className='mb-1 text-black font-bold text-sm cursor-pointer' htmlFor={id}>{label}: </label>}
	  <input required={required} type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className='px-4 py-3 outline-none border rounded-lg text-black'/>
	</div>
  )
}

export default Input
