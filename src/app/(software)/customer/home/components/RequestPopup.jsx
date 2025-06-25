import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog'
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Select, SelectItem } from '@/components/ui/Select';
import { containerTypes, delayTypes } from '@/constants/common';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import React, { useState } from 'react'
import { toast } from 'sonner';

export function RequestPopup({ provider, service }) {
	const { createItem: cfsCreate } = useCollection('cfs_pricing_request');
	const { createItem: warehouseCreate } = useCollection('warehouse_pricing_request');
	const { createItem: transportCreate } = useCollection('transport_pricing_request');
	const { createItem: Create3pl } = useCollection('3pl_pricing_request');
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		preferableRate: '',
		delayType: '',
		containerType: '',
		containersPerMonth: '',
		startDate: new Date().toISOString().split('T')[0],
		startLocation: '',
		endLocation: '',
		specialRequest: '',
		status: 'Pending'
	});
	const { user } = useAuth();

	const handleReset = () => {
		setFormData({
			preferableRate: '',
			delayType: '',
			containerType: '',
			containersPerMonth: '',
			startDate: new Date().toISOString().split('T')[0],
			startLocation: '',
			endLocation: '',
			specialRequest: '',
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
						containersPerMonth: formData.containersPerMonth,
						containerType: formData.containerType,
						delayType: formData.delayType,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case 'Warehouse':
					await warehouseCreate({
						preferableRate: formData.preferableRate,
						containersPerMonth: formData.containersPerMonth,
						containerType: formData.containerType,
						delayType: formData.delayType,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case 'Transport':
					await transportCreate({
						preferableRate: formData.preferableRate,
						containersPerMonth: formData.containersPerMonth,
						startDate: formData.startDate,
						startLocation: formData.startLocation,
						endLocation: formData.endLocation,
						specialRequest: formData.specialRequest,
						user: user.id,
						serviceProvider: provider,
						status: formData.status,
					});
					toast.success("Request sent successfully we'll contact you soon....");
					break;

				case '3PL':
					await Create3pl({
						preferableRate: formData.preferableRate,
						containersPerMonth: formData.containersPerMonth,
						containerType: formData.containerType,
						delayType: formData.delayType,
						startDate: formData.startDate,
						startLocation: formData.startLocation,
						endLocation: formData.endLocation,
						specialRequest: formData.specialRequest,
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
			trigger={<Button title={'Request Price'} className="rounded-md" />}
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
						</>
					)
				}


				{
					!(service === 'Transport') && (
						<>
							<div className="flex flex-col gap-2 relative">
								<Label title="DPD / Non-DPD" />
								<Select
									placeholder="Choose"
									value={formData.delayType}
									onValueChange={(value) => {
										setFormData({ ...formData, delayType: value })
									}}
								>
									{delayTypes.map((item, index) => (
										<SelectItem key={index} value={item.id}>{item.label}</SelectItem>
									))}
								</Select>
							</div>

							<div className="flex flex-col gap-2 relative">
								<Label title="Container Type" />
								<Select
									placeholder="Select Container Type"
									value={formData.containerType}
									onValueChange={(value) => {
										setFormData({ ...formData, containerType: value })
									}}
								>
									{containerTypes.map((item, index) => (
										<SelectItem key={index} value={item.id}>{item.label}</SelectItem>
									))}
								</Select>
							</div>
						</>
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

