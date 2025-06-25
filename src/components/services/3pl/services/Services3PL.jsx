import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ServiceRequests3PL from "../service_requests/ServiceRequests3PL";
import ServiceDetailsTable3PL from "../services_details/ServiceDetailsTable3PL";

export default function Services3PL({ serviceName = '', service = '' }) {
	return (
		<section className="grid gap-8 min-h-dvh">
			<Tabs defaultValue="uploads" className="w-full">
				<TabsList className="grid w-full grid-cols-2 bg-[var(--accent)] shadow-md shadow-foreground/40">
					<TabsTrigger value="requests" className={'w-full'}>Requests</TabsTrigger>
					<TabsTrigger value="uploads" className={'w-full'}>Uploads</TabsTrigger>
				</TabsList>

				<TabsContent value="requests" className="md:p-4 mt-8 w-full h-screen">
					<ServiceRequests3PL serviceName={serviceName} service={service} />
				</TabsContent>

				<TabsContent value="uploads" className="md:p-4 mt-8 w-full h-screen">
					<ServiceDetailsTable3PL serviceName={serviceName} service={service} />
				</TabsContent>
			</Tabs>
		</section>
	)
}

