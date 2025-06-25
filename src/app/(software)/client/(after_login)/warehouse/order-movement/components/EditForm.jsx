import { useState } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import TextArea from "@/components/ui/TextArea";


export default function EditForm({ info }) {
	const { updateItem, mutation } = useCollection('warehouse_order_movement');
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		id: info.id,
		remarks: info.remarks,
		date: new Date(info.date).toISOString().split('T')[0],
		status: info.status,
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
			containerNo: '',
			size: '',
			cargoType: '',
			status: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(user);
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				containerNo: formData.containerNo,
				cargoType: formData.cargoType,
				size: formData.size,
				status: formData.status,
			});
			toast.success('Updated the container');
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
			title="Update Movement Info"
			className='bg-[var(--accent)] cursor-pointer'
		>
			<div className="grid gap-4">
				<div className="flex flex-col gap-2 relative">
					<Label title="Status" />
					<Input
						type="text"
						name="status"
						value={formData.status}
						onChange={handleChange}
						placeholder="eg; Discharged, Delivered,  etc."
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
						className='bg-accent'
					/>
				</div>

				<div className="flex flex-col gap-2 relative">
					<Label title="Remarks" />
					<TextArea
						name="remarks"
						value={formData.remarks}
						onChange={handleChange}
						placeholder="Optional Remarks"
						className="bg-accent"
					/>
				</div>

				<div className="mt-6">
					<Button onClick={handleSubmit} title="Update Container" icon={<Upload />} iconPosition="right" className="rounded-xl" />
				</div>
			</div>
		</Dialog>
	)
}
