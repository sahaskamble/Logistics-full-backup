'use client';

import pbclient from "@/lib/db";
import { createContext, useContext, useState } from "react"

const authContext = createContext({});

export function AuthContextProvider({ children }) {
	const [user, setUser] = useState(pbclient.authStore.record);
	const [loading, setLoading] = useState(null);

	async function Login(emailOrUsername, password, role) {
		try {
			if (emailOrUsername !== '' || emailOrUsername !== null) {
				const identity = emailOrUsername;
				const res = await pbclient.collection('users').authWithPassword(identity, password);
				if (role === res.record.role) {
					setUser(res.record);
					return res;
				} else {
					alert("Role don't match")
				}
			} else {
				console.error("Email or Username must not be empty!!!");
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function Register(email, username, password, passwordConfirm, role) {
		try {
			const data = {
				"email": email,
				"emailVisibility": true,
				"username": username,
				"password": password,
				"passwordConfirm": passwordConfirm,
				"role": role
			};
			const res = await pbclient.collection('users').create(data);
			return res;
		} catch (err) {
			throw new Error(err)
		}
	}

	async function Logout() {
		try {
			await pbclient.authStore.clear();
			localStorage.removeItem('pocketbase_auth');
		} catch (err) {
			console.error(err);
		}
	}

	const value = {
		user,
		loading,
		Login,
		Logout,
		Register
	};

	return (
		<authContext.Provider value={value}>
			{children}
		</authContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(authContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthLayoutProvider')
	}
	return context;
} 
