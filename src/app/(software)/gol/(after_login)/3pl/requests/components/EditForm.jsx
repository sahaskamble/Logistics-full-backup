import { useState } from "react";
import { Upload, Plus, Pencil, CircleX } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function EditForm({ info }) {
	const { updateItem, mutation } = useCollection('cfs_service_requests');
	const [formData, setFormData] = useState({
		id: info.id,
		clientReason: info.clientReason,
		status: 'Rejected'
	});
	const { user } = useAuth();

	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		try {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		} catch (error) {
			console.log(error);
		}
	};

	const handleReset = () => {
		setFormData({
			id: '',
			clientReason: '',
			status: ''
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		try {
			await updateItem(formData.id, {
				clientReason: formData.clientReason,
				golVerified: true,
				golVerifiedBy: user?.id,
				status: formData.status,
			});
			toast.success('Rejected the request');
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
				<CircleX
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
						<Label title={'Reason'} />
						<Input
							type="text"
							name="clientReason"
							value={formData.clientReason}
							onChange={handleChange}
							placeholder="Enter a valid reason"
							className='bg-accent'
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
