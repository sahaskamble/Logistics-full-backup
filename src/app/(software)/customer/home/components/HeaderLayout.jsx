import { useEffect, useState } from "react";
import { LogInIcon, LogOutIcon, ArrowUpRight, Users, UserRound, UserRoundIcon, CircleUserRound } from "lucide-react";
import Button from "@/components/ui/Button";
import { servicesList } from "@/constants/services";
import { CompanyName } from "@/constants/CompanyName";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HeaderLayout({ currentService, setCurrentService, user }) {
	const [displayAfterHeader, setDisplayAfterHeader] = useState(false);
	const { Logout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await Logout();
			router.push('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 150) {
				setDisplayAfterHeader(true)
			} else {
				setDisplayAfterHeader(false)
			}
		}
		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<header>
			{/* Original navigation bar content */}
			<div className={`bg-[var(--background)] 
				${displayAfterHeader ? "opacity-0" : "opacity-100"}
					transition-opacity duration-500 border-b pb-10 border-[var(--foreground)]/60
				`}
			>
				<div className="flex flex-col w-full p-4">
					<div className="flex items-center justify-center w-full">
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-3 rounded-xl overflow-hidden w-10 h-10">
									<Image src={'/logo.png'} width={1500} height={1500} alt="Logo" />
								</div>
								<h1 className="font-bold">{CompanyName}</h1>
							</div>
							<div className="flex items-center gap-3">
								{user ? (
									<>
										<Button
											title={'Dashboard'}
											icon={<ArrowUpRight />}
											iconPosition="right"
											variant={'outline'}
											onClick={() => router.push('/customer/dashboard')}
											className="rounded-md"
										/>
										<Button
											title={'Logout'}
											icon={<LogOutIcon size={20} />}
											iconPosition="right"
											className="rounded-md bg-red-600 hover:bg-red-700 text-white"
											onClick={handleLogout}
										/>
									</>
								) : (
									<>
										<Button
											title={'Dashboard'}
											icon={<ArrowUpRight />}
											iconPosition="right"
											variant={'outline'}
											onClick={() => router.push('/customer/dashboard')}
											className="rounded-md"
										/>
										<Button
											title={'Login'}
											icon={<CircleUserRound size={20} />}
											iconPosition="right"
											className="rounded-md"
											onClick={() => router.push('/customer/login')}
										/>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Services List */}
				<div className={`bg-[var(--accent)] py-3 px-4 rounded-xl mx-auto w-xl flex justify-between items-center shadow-md border border-gray-200 opacity-100`}>
					<div className="flex justify-center space-x-12 flex-1">
						{servicesList.map((item) => (
							<Button
								key={item.id}
								title={item.label}
								icon={<item.icon className={`h-6 w-6`} />}
								iconPosition="top"
								className="max-w-xl text-sm"
								variant={currentService === item.id ? 'link' : 'none'}
								onClick={() => setCurrentService(item.label)}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Fixed header that appears when scrolled */}
			<div
				className={`fixed top-0 left-0 right-0 z-50 bg-[var(--accent)] shadow-lg py-2 px-3 sm:px-6 transition-transform duration-300 min-h-20 flex items-center  
							${displayAfterHeader ? "translate-y-0" : "-translate-y-full"}
						`}
			>
				<div className="w-full flex justify-between items-center">
					<div className="flex items-center justify-center">
						<div className="flex gap-3 items-center mr-2 sm:mr-4 flex-shrink-0">
							<div className="flex items-center gap-3 rounded-xl overflow-hidden w-10 h-10">
								<Image src={'/logo.png'} width={1500} height={1500} alt="Logo" />
							</div>
							<span className="font-bold text-sm">{CompanyName}</span>
						</div>
					</div>
					<div className="flex space-x-1 sm:space-x-2 md:space-x-3">
						{servicesList.map((item) => (
							<Button
								key={item.id}
								title={item.label}
								icon={<item.icon className={`h-6 w-6`} />}
								iconPosition="top"
								className="max-w-xl text-[12px]"
								variant={currentService === item.id ? 'link' : 'none'}
								onClick={() => setCurrentService(item.id)}
							/>
						))}
					</div>

					{
						user ? (
							<div className="flex items-center space-x-2">
								<div className="flex items-center">
									<div className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center mr-2">
										<Users className="h-5 w-5 text-[var(--background)]" />
									</div>
									<span className="text-sm font-medium text-gray-700 hidden sm:block">
										{user.firstname || user.username}
									</span>
								</div>
								<Button
									title={'Logout'}
									icon={<LogOutIcon size={16} />}
									iconPosition="right"
									className="rounded-md bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
									onClick={handleLogout}
								/>
							</div>
						) : (
							<Button
								title={'Login'}
								icon={<LogInIcon />}
								iconPosition="right"
								className="rounded-md"
								onClick={() => router.push('/login')}
							/>
						)
					}

				</div>
			</div>
		</header>
	)
}
