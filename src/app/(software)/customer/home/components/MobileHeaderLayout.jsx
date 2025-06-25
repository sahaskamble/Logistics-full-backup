import Button, { ButtonCard } from "@/components/ui/Button";
import { CompanyName } from "@/constants/CompanyName";
import { servicesList } from "@/constants/services";
import { ArrowUpRight, LogInIcon, LogOutIcon, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileHeaderLayout({ currentService, setCurrentService, user }) {
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

	return (
		<header className="flex flex-col gap-8 w-full py-4 border-b">
			{/* Upper Portion */}
			<div className="flex items-center justify-center w-full">
				<div className="flex justify-between items-center px-3 gap-3 w-full">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1 rounded-xl overflow-hidden w-8 h-8">
							<Image src={'/logo.png'} width={200} height={200} alt="Logo" />
						</div>
						<h1 className="font-bold">{CompanyName}</h1>
					</div>
					<div className="flex items-center gap-4">
						{user ? (
							<>
								<Link href={'/customer/dashboard'} className="inline-flex gap-2 text-sm">
									<ArrowUpRight size={20} />
									Dashboard
								</Link>
								<button onClick={handleLogout} className="inline-flex gap-2 text-sm text-red-600 hover:text-red-700">
									<LogOutIcon size={18} />
									Logout
								</button>
							</>
						) : (
							<>
								<button onClick={() => router.push('/login')} className="inline-flex gap-2 text-sm">
									<ArrowUpRight size={20} />
									Dashboard
								</button>
								<button onClick={() => router.push('/login')} className="inline-flex gap-2 text-sm">
									<UserRound size={18} />
									Login
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Services List */}
			<div className="grid grid-cols-3 p-4 gap-2 rounded-xl">
				{servicesList.map((service) => (
					<ButtonCard
						key={service.id}
						title={service.label}
						icon={<service.icon className={`h-9 w-9`} />}
						iconPosition="top"
						className={`max-w-xl bg-[var(--accent)] text-[var(--primary)] p-6 rounded-xl shadow-lg font-normal
							${currentService === service.id ? 'border-[var(--primary)] border-2 text-[var(--primary)] font-extrabold' : 'shadow-[var(--accent)]'} `}
						variant={'none'}
						onClick={() => setCurrentService(service.id)}
					/>
				))}
			</div>
		</header>
	)
}
