import { useState } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { status } from "@/constants/common";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import TextArea from "@/components/ui/TextArea";

export default function EditForm({ info }) {
	const { updateItem, mutation } = useCollection('cfs_service_details');
	const [formData, setFormData] = useState({
		id: info.id,
		remarks: info.remarks,
		fromDate: new Date(info.fromDate).toISOString().split('T')[0],
		toDate: new Date(info.toDate).toISOString().split('T')[0],
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
			id: '',
			remarks: '',
			fromDate: new Date().toISOString().split('T')[0],
			toDate: new Date().toISOString().split('T')[0],
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				fromDate: formData.fromDate,
				toDate: formData.toDate,
				remarks: formData.remarks,
			});
			toast.success('Updated the info');
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
			title="Update Info"
			className='bg-[var(--accent)] cursor-pointer'
		>
			<div>
				<form className="grid grid-cols-1 gap-4 min-w-[300px]">
					<div className='flex flex-col gap-2'>
						<Label title="From" />
						<Input
							type="date"
							name="fromDate"
							value={formData.fromDate}
							onChange={handleChange}
							placeholder="Select date"
							className='bg-accent'
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label title="To" />
						<Input
							type="date"
							name="toDate"
							value={formData.toDate}
							onChange={handleChange}
							placeholder="Select date"
							className='bg-accent'
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label title="Remarks" />
						<TextArea
							name='remarks'
							value={formData.remarks}
							onChange={handleChange}
							placeholder="Enter Remarks...."
						/>
					</div>
				</form>

				<div className='mt-8'>
					<Button
						title="Submit"
						icon={<Upload />}
						onClick={handleSubmit}
						className="rounded-xl"
					/>
				</div>
			</div>
		</Dialog>
	)
}
