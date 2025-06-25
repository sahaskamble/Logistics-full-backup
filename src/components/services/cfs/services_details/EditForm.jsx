import { useState } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { status } from "@/constants/common";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import TextArea from "@/components/ui/TextArea";

export default function EditForm({ info }) {
	const { updateItem, mutation } = useCollection('cfs_service_details');
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		id: info.id,
		agent: info.agent,
		receiptNo: info.receiptNo,
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
			id: '',
			agent: '',
			receiptNo: '',
			remarks: '',
			date: new Date().toISOString().split('T')[0],
			status: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(user);
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				agent: formData.agent,
				receiptNo: formData.receiptNo,
				remarks: formData.remarks,
				date: formData.date,
				status: formData.status,
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
						<Label title={'Agent / Supervisor'} />
						<Input
							type="text"
							name="agent"
							value={formData.agent}
							onChange={handleChange}
							placeholder="Enter Agent Name"
							className="bg-accent"
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<Label title={'Receipt No.'} />
						<Input
							type="text"
							name="receiptNo"
							value={formData.receiptNo}
							onChange={handleChange}
							placeholder="Enter Receipt No. (if any)"
							className="bg-accent"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label title="Status" />
						{
							status?.length > 0 && (
								<Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} placeholder='Select a Service'>
									{
										status
											.map((item, index) => (
												<SelectItem key={index} value={item?.id}>{item?.label}</SelectItem>
											))
									}
								</Select>

							)
						}
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
