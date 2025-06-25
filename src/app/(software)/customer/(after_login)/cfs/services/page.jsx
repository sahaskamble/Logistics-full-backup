'use client'
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarProvider";
import { Search } from "lucide-react";
import { cfsServices } from "@/constants/services";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function CFSServices() {
	const router = useRouter();
	const { setTitle } = useSidebar();
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredServices, setFilteredServices] = useState(cfsServices);

	useEffect(() => {
		setTitle('CFS Services')
	}, []);

	const handleSearch = (e) => {
		const value = e.target.value;
		if (value === '') {
			setFilteredServices(cfsServices);
		} else {
			setFilteredServices(cfsServices.filter((service) => service.title.toLowerCase().includes(value.toLowerCase())));
		}
		setSearchQuery(value);
	}

	return (
		<section className="p-4">
			<div className="flex items-center shadow-md shadow-foreground/40 px-3 py-1 rounded-md bg-[var(--accent)]">
				<Search className="mr-3" />
				<input
					type='text' placeholder='Search Service by Name...' value={searchQuery} onChange={handleSearch}
					className='h-auto py-2 flex w-full  bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)] placeholder:text-[var(--secondary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm' />
			</div>

			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-10">
				{filteredServices.map((service, index) => (
					<div key={index} className="border border-[var(--primary)] shadow-md shadow-foreground/40 bg-[var(--accent)] p-4 rounded-xl flex flex-col gap-2">
						<service.icon className="bg-[var(--background-2)] border-2 border-[var(--light-primary)] p-2 w-10 h-10 text-[var(--light-primary)] rounded-md" />
						<h1 className="text-xl font-semibold">{service.title}</h1>
						<p className="text-sm">{service.description}</p>
						<Button title={'View'} className="rounded-xl" onClick={() => router.push(service.href)} />
					</div>
				))}
			</div>
		</section>
	)
}

