import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase_config";
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "./auth";
import { collection, onSnapshot, query } from "firebase/firestore";


const DataContext = createContext();

const DataContextProvider = ({ children }) => {
	const { user } = UseAuthContext();
	const [contracts, setContracts] = useState([])

	useEffect(() => {
		if (user) {
			const q = query(collection(db, "contracts"));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const data = [];
				querySnapshot.forEach((doc) => {
					data.push({...doc.data(), id: doc.id});
				});
				setContracts(data)
			});
			return () => {
				unsubscribe()
			}
		}
	}, [user]);

	return <DataContext.Provider value={{ contracts }}>
		{children}
	</DataContext.Provider>
}

const UseDataContext = () => {
	return useContext(DataContext);
}

export { DataContextProvider, UseDataContext }