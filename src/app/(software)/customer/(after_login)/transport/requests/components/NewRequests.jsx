import { useState } from "react";
import { FileText, Upload, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Label from "@/components/ui/Label";
import TextArea from "@/components/ui/TextArea";
import { Select, SelectItem } from "@/components/ui/Select";
import OrderInput from "./OrderInput";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function NewRequests() {
	const { data: warehouseServices } = useCollection('sub_services', {
		expand: 'service'
	});
	const { createItem, mutation } = useCollection('warehouse_service_requests');
	const { user } = useAuth();

	const [formData, setFormData] = useState({
		customerRemarks: '',
		status: 'Pending',
		serviceType: '',
		files: [],
	});
	const [orderId, setOrderId] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleServiceChange = (value) => {
		setFormData({
			...formData,
			serviceType: value
		});
	};

	const handleReset = () => {
		setFormData({
			customerRemarks: '',
			status: 'Pending',
			serviceType: '',
			files: [],
		});
		setOrderId('');
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData((prev) => ({
			...prev,
			files
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = new FormData();
			data.append('order', orderId);
			data.append('customerRemarks', formData.customerRemarks);
			data.append('serviceType', formData.serviceType);
			data.append('user', user?.id);
			data.append('status', formData.status);
			// Append each file
			formData.files.forEach((file) => {
				data.append('files', file); // `files` must match the PocketBase field name
			});

			console.log('Form submitted:', data);
			await createItem(data);
			toast.success('Sent a new request');
		} catch (error) {
			console.log(error)
			toast.error(error.message);
		} finally {
			handleReset();
			mutation();
			setIsOpen(false);
		}
	};


	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
			trigger={<Button title="New Request" icon={<FileText />} className="rounded-lg" textSize="text-sm" />}
			title="New Request"
			className='md:w-[200px] bg-[var(--accent)]'
		>
			<div className="grid gap-4 min-w-[40dvw]">
				<OrderInput setOrderId={setOrderId} />

				<div className="flex flex-col gap-2">
					<Label title="Service Type" />
					{
						warehouseServices?.length > 0 && (
							<Select value={formData.serviceType} onValueChange={handleServiceChange} placeholder='Select a Service'>
								{
									warehouseServices
										.filter((service) =>
											service?.expand?.service?.title === 'Warehouse' && (
												service?.title !== 'Tariff Uploads' && service?.title !== 'Job Order Update')
										)
										.map((service, index) => (
											<SelectItem key={index} value={service?.id}>{service?.title}</SelectItem>
										))
								}
							</Select>

						)
					}
				</div>

				<div className="flex flex-col gap-2 relative">
					<Label title="Remarks" />
					<TextArea
						name="customerRemarks"
						value={formData.customerRemarks}
						onChange={handleChange}
						placeholder="Enter Remarks (optional)"
						className="bg-accent"
					/>
				</div>

				<div className='flex flex-col gap-2 mt-4'>
					<Label title={'Upload Documents'} />
					<div className="flex items-center gap-2 mt-2">
						<label className="flex items-center cursor-pointer border rounded-xl px-4 py-2 bg-accent">
							<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
							</svg>
							<span className='text-sm'>Choose File</span>
							<input
								type="file"
								className="hidden"
								multiple
								onChange={handleFileChange}
							/>
						</label>
						<span className="ml-2 text-sm text-gray-500">
							{formData.files.length > 0
								? formData.files.map((file) => file.name).join(', ')
								: 'No files chosen'}
						</span>
					</div>
				</div>

				<div className="mt-6">
					<Button onClick={handleSubmit} title="Request" icon={<Upload />} iconPosition="right" className="rounded-xl" />
				</div>
			</div>
		</Dialog>
	);
}
