'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import RequestTable from "./components/Table";
import Table from "@/app/(software)/gol/(after_login)/components/Table";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<section className="grid gap-8 min-h-dvh">
			<Tabs defaultValue="requests" className="w-full">
				<TabsList className="grid w-full grid-cols-2 bg-[var(--accent)] shadow-md shadow-foreground/40">
					<TabsTrigger value="requests" className={'w-full'}>Requests</TabsTrigger>
					<TabsTrigger value="uploads" className={'w-full'}>Uploads</TabsTrigger>
				</TabsList>

				<TabsContent value="requests" className="md:p-4 w-full h-screen">
					<RequestTable />
				</TabsContent>

				<TabsContent value="uploads" className="md:p-4 w-full h-screen">
					<Table serviceName="Tariff Uploads" />
				</TabsContent>
			</Tabs>
		</section>
	)
}

