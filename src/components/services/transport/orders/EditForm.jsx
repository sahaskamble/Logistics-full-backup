import { useState } from "react";
import { Upload, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";

export default function EditForm(
	{
		info = {
			id: '',
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			startLocation: '',
			endLocation: '',
			specialRequest: '',
			consigneeName: '',
			chaName: '',
			vehicleDescription: '',
			orderDescription: '',
		}
	}
) {

	const { updateItem, mutation } = useCollection('transport_orders');
	const [formData, setFormData] = useState({
		id: info.id,
		consigneeName: info.consigneeName,
		chaName: info.chaName,
		startDate: new Date(info.startDate).toISOString().split('T')[0],
		endDate: new Date(info.endDate).toISOString().split('T')[0],
		startLocation: info.startLocation,
		endLocation: info.endLocation,
		specialRequest: info.specialRequest,
		vehicleDescription: info.vehicleDescription,
		orderDescription: info.orderDescription,
	});
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
			consigneeName: '',
			chaName: '',
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			startLocation: '',
			endLocation: '',
			specialRequest: '',
			vehicleDescription: '',
			orderDescription: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				consigneeName: formData.consigneeName,
				chaName: formData.chaName,
				startDate: formData.startDate,
				endDate: formData.endDate,
				startLocation: formData.startLocation,
				endLocation: formData.blNo,
				specialRequest: formData.specialRequest,
				vehicleDescription: formData.vehicleDescription,
				orderDescription: formData.orderDescription,
			});
			toast.success('Updated the order');
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
				<Pencil
					size={18}
					className="cursor-pointer text-primary"
				/>
			}
			title="Update Order Info"
			className='bg-[var(--accent)] cursor-pointer'
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[60dvw]">
				<div className='flex flex-col items-start gap-2'>
					<Label title={'Consignee Name'} />
					<Input
						type="text"
						name="consigneeName"
						value={formData.consigneeName}
						onChange={handleChange}
						placeholder="Enter Consignee Name"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'CHA Name'} />
					<Input
						type="text"
						name="chaName"
						value={formData.chaName}
						onChange={handleChange}
						placeholder="Enter CHA Name"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title="Start Date" />
					<Input
						type="date"
						name="startDate"
						value={formData.startDate}
						onChange={handleChange}
						placeholder="Select date"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title="End Date" />
					<Input
						type="date"
						name="endDate"
						value={formData.endDate}
						onChange={handleChange}
						placeholder="Select date"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'Start Location'} />
					<Input
						type="text"
						name="startLocation"
						value={formData.startLocation}
						onChange={handleChange}
						placeholder="Enter Start Location"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'End Location'} />
					<Input
						type="text"
						name="endLocation"
						value={formData.endLocation}
						onChange={handleChange}
						placeholder="Enter End Location"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'Special Request'} />
					<Input
						type="text"
						name="specialRequest"
						value={formData.specialRequest}
						onChange={handleChange}
						placeholder="Enter Special Request"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'Vehicle Description'} />
					<Input
						type="text"
						name="vehicleDescription"
						value={formData.vehicleDescription}
						onChange={handleChange}
						placeholder="Enter Vehicle Description"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'Order Description'} />
					<Input
						type="text"
						name="orderDescription"
						value={formData.orderDescription}
						onChange={handleChange}
						placeholder="Enter Order Description"
						className='bg-accent'
					/>
				</div>
			</div>

			<div className="mt-6">
				<Button onClick={handleSubmit} title="Update Order" icon={<Upload />} iconPosition="right" className="rounded-xl" />
			</div>
		</Dialog>
	)
}
