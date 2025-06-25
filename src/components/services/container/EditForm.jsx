import { useState } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { containerConditions } from "@/constants/common";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


export default function EditForm(
	{
		info = { id: '', containerNo: '', size: '', ownedBy: '', cargoType: '', status: '' }
	}
) {

	const { updateItem, mutation } = useCollection('containers');
	const { user } = useAuth();
	const [formData, setFormData] = useState(info);
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
			title="Update Container Info"
			className='bg-[var(--accent)] cursor-pointer'
		>
			<div className="grid gap-4">
				<div className="flex flex-col gap-2 relative">
					<Label title="Container No." />
					<Input
						type="text"
						name="containerNo"
						value={formData.containerNo}
						onChange={handleChange}
						placeholder="Enter a container No."
						className="bg-accent"
					/>
				</div>

				<div className="flex flex-col gap-2 relative">
					<Label title="Container Size" />
					<Input
						type="text"
						name="size"
						value={formData.size}
						onChange={handleChange}
						placeholder="eg; 20 ft, 40 ft"
						className="bg-accent"
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label title={'Cargo Type'} />
					<Input
						type="text"
						name="cargoType"
						value={formData.cargoType}
						onChange={handleChange}
						placeholder="eg; Dry, Liquid, etc."
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
						{containerConditions.map((condition, index) => (
							<SelectItem key={index} value={condition.id}>{condition.label}</SelectItem>
						))}
					</Select>
				</div>

				<div className="mt-6">
					<Button onClick={handleSubmit} title="Update Container" icon={<Upload />} iconPosition="right" className="rounded-xl" />
				</div>
			</div>
		</Dialog>
	)
}
