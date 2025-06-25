'use client';

import { useEffect, useState } from "react";
import Label from "@/components/ui/Label";
import { ArrowRightToLine, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import Button from "@/components/ui/Button";

export default function LoginPage() {
	const [emailOrusername, setEmailOrUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { user, Login } = useAuth();
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await Login(emailOrusername, password, ROLES.CUSTOMER);
			if (res) {
				localStorage.setItem('record', JSON.stringify(res));
				localStorage.setItem('role', ROLES.CUSTOMER);
				router.push('/customer/home')
			} else {
				alert('Login Unsuccessful');
			}
		} catch (err) {
			alert(err);
			console.error(err);
		}
	}

	useEffect(() => {
		if (user) {
			router.push('/customer/home')
		}
	}, [user]);


	return (
		<div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
			style={{ backgroundImage: 'url("/cargo-ship.png")' }}
		>
			<div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>
			<div className="bg-white/50 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
				<div className="text-center mb-6">
					<div className="text-sm font-bold text-green-700">Logo</div>
					<h2 className="text-2xl font-semibold text-green-800 mt-2">Welcome to Green Ocean</h2>
					<p className="text-sm text-gray-500 mt-1">Login to Your Account</p>
				</div>

				<form action="" onSubmit={handleLogin} className="space-y-5">
					<div className="space-y-1">
						<Label title="Email Address or Username" className="text-gray-700" htmlFor="email" />

						<Input
							type="text"
							name="email"
							id="email"
							value={emailOrusername}
							onChange={(e) => setEmailOrUsername(e.target.value)}
							placeholder='you@gmail.com'
							className="bg-green-50"
							required
							aria-label="Email Address or Username"
						/>
					</div>

					<div className="space-y-1">
						<Label title="Password" className="text-gray-700" htmlFor="password" />
						<div className="relative">
							<Input
								type={showPassword ? "text" : "password"}
								name="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='*********'
								className='bg-green-50 pr-10'
								required
								aria-label="Password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									<Eye className="w-4 h-4" />
								) : (
									<EyeOff className="w-4 h-4" />
								)}
							</button>
						</div>
					</div>

					<Button
						type='submit'
						className='w-full bg-green-700 hover:bg-green-800 text-white'
						title={'Login'}
						icon={<ArrowRightToLine />}
					/>
				</form>

				<div className="flex items-center my-4">
					<div className="flex-grow h-px bg-gray-300"></div>
					<span className="px-2 text-gray-500 text-sm">or</span>
					<div className="flex-grow h-px bg-gray-300"></div>
				</div>

				<Button
					variant='outline'
					className='w-full flex items-center justify-center gap-2'
					type='button'
					icon={<FcGoogle />}
					title={'Login with Google'}
					onClick={() => alert('Google Login is Comming soon')}
				/>

				<p className="text-center text-sm mt-4">
					Don't have an account?{""}
					<a href="" className="text-green-700 font-semibold hover:underline">Sign Up</a>
				</p>

				<p className="text-center text-xs text-gray-700 mt-2">
					Need Help?
					<a href="mailto:support@greenlogistics.com" className="text-green-600 hover:underline">support@greenlogistics.com</a>
				</p>
			</div>
		</div>
	)
}
