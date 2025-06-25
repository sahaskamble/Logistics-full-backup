import { useState } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
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
			igmNo: '',
			blNo: '',
			boeNo: '',
			consigneeName: '',
			chaName: '',
			fromDate: new Date().toISOString().split('T')[0],
			toDate: new Date().toISOString().split('T')[0],
			orderDescription: '',
		}
	}
) {

	const { updateItem, mutation } = useCollection('cfs_orders');
	const [formData, setFormData] = useState({
		id: info.id,
		igmNo: info.igmNo,
		blNo: info.blNo,
		boeNo: info.boeNo,
		consigneeName: info.consigneeName,
		chaName: info.chaName,
		fromDate: new Date(info.fromDate).toISOString().split('T')[0],
		toDate: new Date(info.toDate).toISOString().split('T')[0],
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
			igmNo: '',
			blNo: '',
			boeNo: '',
			consigneeName: '',
			chaName: '',
			fromDate: new Date().toISOString().split('T')[0],
			toDate: new Date().toISOString().split('T')[0],
			orderDescription: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				igmNo: formData.igmNo,
				blNo: formData.blNo,
				boeNo: formData.boeNo,
				consigneeName: formData.consigneeName,
				chaName: formData.chaName,
				fromDate: formData.fromDate,
				toDate: formData.toDate,
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
			title="Update Container Info"
			className='bg-[var(--accent)] cursor-pointer'
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[60dvw]">
				<div className='flex flex-col items-start gap-2'>
					<Label title={'IGM Number'} />
					<Input
						type="text"
						name="igmNo"
						value={formData.igmNo}
						onChange={handleChange}
						placeholder="Enter IGM number"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'BL Number'} />
					<Input
						type="text"
						name="blNo"
						value={formData.blNo}
						onChange={handleChange}
						placeholder="Enter BL number"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title={'BOE Number'} />
					<Input
						type="text"
						name="boeNo"
						value={formData.boeNo}
						onChange={handleChange}
						placeholder="Enter BOE number"
						className='bg-accent'
					/>
				</div>

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
					<Label title="From Date" />
					<Input
						type="date"
						name="fromDate"
						value={formData.fromDate}
						onChange={handleChange}
						placeholder="Select date"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col items-start gap-2'>
					<Label title="To Date" />
					<Input
						type="date"
						name="toDate"
						value={formData.toDate}
						onChange={handleChange}
						placeholder="Select date"
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
