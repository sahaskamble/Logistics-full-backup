import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog'
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import React, { useState } from 'react'
import { toast } from 'sonner';

export default function UrgentRequestPopup({ provider, service }) {
	const { createItem: cfsCreate } = useCollection('cfs_pricing_request');
	const { createItem: warehouseCreate } = useCollection('warehouse_pricing_request');
	const { createItem: transportCreate } = useCollection('transport_pricing_request');
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		preferableRate: '',
		noOfContainers: '',
		avgContainerSize: '',
		containersPerMonth: '',
		startDate: new Date().toISOString().split('T')[0],
		startLocation: '',
		endLocation: '',
		specialRequest: '',
		type: 'Urgent',
		status: 'Pending'
	});
	const { user } = useAuth();

	const handleReset = () => {
		setFormData({
			preferableRate: '',
			noOfContainers: '',
			avgContainerSize: '',
			containersPerMonth: '',
			startDate: new Date().toISOString().split('T')[0],
			startLocation: '',
			endLocation: '',
			specialRequest: '',
			type: 'Urgent',
			status: 'Pending'
		});
	};

	const handleNumberChange = (e) => {
		const { name, value } = e.target;
		try {
			if (value !== '') {
				setFormData((prev) => ({
					...prev,
					[name]: value,
				}));
			} else if (!isNaN(value)) {
				setFormData((prev) => ({
					...prev,
					[name]: parseInt(value),
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: '',
				}));
			}

		} catch (error) {
			console.log(error);
		}
	};

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(user);
		console.log('Form submitted:', formData);
		try {
			switch (service) {
				case 'CFS':
					await cfsCreate({
						preferableRate: formData.preferableRate,
						noOfContainers: formData.noOfContainers,
						avgContainerSize: formData.avgContainerSize,
						containersPerMonth: formData.containersPerMonth,
						type: formData.type,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case 'Warehouse':
					await warehouseCreate({
						preferableRate: formData.preferableRate,
						noOfContainers: formData.noOfContainers,
						avgContainerSize: formData.avgContainerSize,
						containersPerMonth: formData.containersPerMonth,
						type: formData.type,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case 'Transport':
					await transportCreate({
						preferableRate: formData.preferableRate,
						noOfContainers: formData.noOfContainers,
						avgContainerSize: formData.avgContainerSize,
						containersPerMonth: formData.containersPerMonth,
						startDate: formData.startDate,
						startLocation: formData.startLocation,
						endLocation: formData.endLocation,
						type: formData.type,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case '3PL':
					await Create3pl({
						preferableRate: formData.preferableRate,
						noOfContainers: formData.noOfContainers,
						avgContainerSize: formData.avgContainerSize,
						containersPerMonth: formData.containersPerMonth,
						startDate: formData.startDate,
						startLocation: formData.startLocation,
						endLocation: formData.endLocation,
						specialRequest: formData.specialRequest,
						type: formData.type,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				default:
					break;
			}
		} catch (error) {
			console.log(error)
			toast.error(error.message);
		} finally {
			handleReset();
			setIsOpen(false);
		}
	};

	return (
		<Dialog
			title={'Request Pricing'}
			open={isOpen}
			onOpenChange={setIsOpen}
			trigger={<Button title={'Urgent Price'} className="rounded-md md:text-base text-xs" variant={'secondary'} />}
		>
			<div className='md:w-[40dvw] grid gap-4'>
				{
					(service === 'Transport' || service === '3PL') && (
						<>
							<div className='flex flex-col gap-2'>
								<Label title="Start Date for commute" />
								<Input
									type="date"
									name="startDate"
									value={formData.startDate}
									onChange={handleChange}
									placeholder="Select date"
									className='bg-accent'
								/>
							</div>

							<div className='flex flex-col gap-2'>
								<Label title={'Pick-Up Location'} />
								<Input
									type="text"
									name="startLocation"
									value={formData.startLocation}
									onChange={handleChange}
									placeholder="Enter Pick-Up Location"
									className='bg-accent'
								/>
							</div>

							<div className='flex flex-col gap-2'>
								<Label title={'Drop Location'} />
								<Input
									type="text"
									name="endLocation"
									value={formData.endLocation}
									onChange={handleChange}
									placeholder="Enter Drop Location"
									className='bg-accent'
								/>
							</div>
						</>
					)
				}

				{
					(service === '3PL') && (
						<div className='flex flex-col gap-2'>
							<Label title={'Special Request'} />
							<Input
								type="text"
								name="specialRequest"
								value={formData.specialRequest}
								onChange={handleChange}
								placeholder="Enter any Special Request"
								className='bg-accent'
							/>
						</div>
					)
				}

				<div className='flex flex-col gap-2'>
					<Label title={'Preferable Rate'} />
					<Input
						type="number"
						name="preferableRate"
						value={formData.preferableRate}
						onChange={handleNumberChange}
						placeholder="Enter Preferable Rate"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label title={'No of Containers for the Order'} />
					<Input
						type="number"
						name="noOfContainers"
						value={formData.noOfContainers}
						onChange={handleNumberChange}
						placeholder="Enter No of Containers for the Order"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label title={'Avg. Container Size'} />
					<Input
						type="number"
						name="avgContainerSize"
						value={formData.avgContainerSize}
						onChange={handleNumberChange}
						placeholder="Enter Avg. Container Size"
						className='bg-accent'
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Label title={'No. of Containers Movement per month'} />
					<Input
						type="number"
						name="containersPerMonth"
						value={formData.containersPerMonth}
						onChange={handleNumberChange}
						placeholder="Enter No. of Containers Movement per month"
						className='bg-accent'
					/>
				</div>

				<div className='flex'>
					<Button title={'Request Pricing'} className='rounded-md' onClick={handleSubmit} />
				</div>
			</div>
		</Dialog>
	)
}

