import React from 'react'

const Button = ({ text, onClick, type, loading, disabled }) => {
  return (
    <>
      {type === "submit" ? <button disabled={loading && disabled} type={"submit"} className='font-bold text-white px-5 py-2 rounded-lg duration-150 bg-blue-700 hover:bg-blue-800'>{!loading ? text : "Loading..."}</button> : <button onClick={onClick} type={"button"} className='font-bold text-white px-5 py-2 rounded-lg duration-150 bg-blue-700 hover:bg-blue-800'>{!loading ? text : "Loading..."}</button>}
    </>
  )
}

export default Button
