import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { vehicleStatus } from "@/constants/common";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Form() {
	const { createItem, mutation } = useCollection('vehicles');
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		ownedBy: '',
		vehicleNo: '',
		name: '',
		status: '',
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
			ownedBy: '',
			vehicleNo: '',
			name: '',
			status: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(user);
		console.log('Form submitted:', formData);
		try {
			await createItem({
				ownedBy: user.id,
				vehicleNo: formData.vehicleNo,
				name: formData.name,
				status: formData.status,
			});
			toast.success('Added the new vehicle');
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
					title={'Add Vehicle'}
					icon={<Plus className='w-5 h-5' />}
					iconPosition='right'
					className='rounded-md'
					textSize='text-sm'
				/>
			}
			title="Create New Vehicle"
			className='bg-[var(--accent)]'
		>
			<div className="grid gap-4">
				<div className="flex flex-col gap-2 relative">
					<Label title="Vehicle No." />
					<Input
						type="text"
						name="vehicleNo"
						value={formData.vehicleNo}
						onChange={handleChange}
						placeholder="eg; MH05AB1234, MH04CD5678"
						className="bg-accent"
					/>
				</div>

				<div className="flex flex-col gap-2 relative">
					<Label title="Vehicle Name" />
					<Input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Enter a name for vehicle"
						className="bg-accent"
					/>
				</div>

				<div className="flex flex-col gap-2 relative">
					<Label title="Status" />
					<Select
						placeholder="Status"
						value={formData.status}
						onValueChange={(value) => {
							setFormData({ ...formData, status: value })
						}}
					>
						{vehicleStatus.map((condition, index) => (
							<SelectItem key={index} value={condition.id}>{condition.label}</SelectItem>
						))}
					</Select>
				</div>

				<div className="mt-6">
					<Button onClick={handleSubmit} title="Add Vehicle" icon={<Upload />} iconPosition="right" className="rounded-xl" />
				</div>
			</div>
		</Dialog>
	);
}
