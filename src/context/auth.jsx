import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase_config";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState()
	const navigate = useNavigate()

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user)
			} else {
				navigate("/")
			}
		});
	}, []);
	return <AuthContext.Provider value={{ user, setUser }}>
		{children}
	</AuthContext.Provider>
}

const UseAuthContext = () => {
	return useContext(AuthContext);
}

export { AuthContextProvider, UseAuthContext }