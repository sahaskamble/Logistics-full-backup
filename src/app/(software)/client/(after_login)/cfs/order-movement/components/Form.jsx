import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import OrderInput from "@/app/(software)/client/components/OrderInput";
import TextArea from "@/components/ui/TextArea";

export default function Form() {
	const { createItem, mutation } = useCollection('cfs_order_movement');
	const [formData, setFormData] = useState({
		status: '',
		date: new Date().toISOString().split('T')[0],
		remarks: '',
		files: []
	});
	const [orderId, setOrderId] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleReset = () => {
		setFormData({
			status: '',
			date: new Date().toISOString().split('T')[0],
			remarks: '',
			files: []
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
			data.append('date', formData.date);
			data.append('remarks', formData.remarks);
			data.append('status', formData.status);
			// Append each file
			formData.files.forEach((file) => {
				data.append('files', file); // `files` must match the PocketBase field name
			});

			console.log('Form submitted:', data);
			await createItem(data);
			toast.success('Created a new entry');
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
			trigger={
				<Button
					title={'Add Movement'}
					icon={<Plus className='w-5 h-5' />}
					iconPosition='right'
					className='rounded-md'
					textSize='text-sm'
				/>
			}
			title="Create a New Order Movement"
			className='bg-accent'
		>
			<div className="grid gap-4 md:min-w-[40dvw] min-w-[80dvw]">

				<OrderInput setOrderId={setOrderId} />

				<div className="flex flex-col gap-2 relative">
					<Label title="Status of the Order" />
					<Input
						type="text"
						name="status"
						value={formData.status}
						onChange={handleChange}
						placeholder="eg; Customs Clearance, Discharged, etc."
						className="bg-accent"
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label title="Date of Execution" />
					<Input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						placeholder="Select date"
						className="bg-accent"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label title="Remarks" />
					<TextArea
						name="remarks"
						placeholder="Optional remarks..."
						value={formData.remarks}
						onChange={handleChange}
						className="bg-accent"
					/>
				</div>

				<div className='flex flex-col gap-2'>
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
					<Button onClick={handleSubmit} title="Add Container" icon={<Upload />} iconPosition="right" className="rounded-xl" />
				</div>
			</div>
		</Dialog>
	);
}
