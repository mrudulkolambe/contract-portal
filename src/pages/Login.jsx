import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase_config";
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate();

	const handleSignup = (e) => {
		e.preventDefault();
		if (email && password) {
			setLoading(true)
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					setLoading(false)
					navigate("/create")
				})
				.catch((error) => {
					setLoading(false)
					alert(error.message)
				});
		} else {
			alert("Please fill the form completely")
		}
	}

	return (
		<main className='h-screen w-screen flex items-center justify-center bg-[#eee]'>
			<form onSubmit={handleSignup} className='w-[40vw] h-auto bg-white border rounded-lg p-5 gap-3 flex flex-col'>
				<img src="https://connectiainfotech.in/static/images/logo/logo.png" className='h-16 object-contain' alt="" />
				<h1 className='text-3xl font-bold text-center mb-3'>Login</h1>
				<Input required={true} onChange={(e) => { setEmail(e.target.value) }} label={"Email Address"} value={email} placeholder={"Enter your email"} type={"email"} />
				<Input required={true} onChange={(e) => { setPassword(e.target.value) }} label={"Password"} value={password} placeholder={"Enter your password"} type={"password"} />
				<Button loading={loading} type={"submit"} text={"Login"} />
			</form>

		</main>
	)
}

export default Login
