import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { Check } from "lucide-react";
import { useState } from "react";

export default function VehicleInput({ setVehicleId }) {
	const { data: vehicles } = useCollection('vehicles');
	console.log(vehicles);

	const [formData, setFormData] = useState({
		vehicleId: '',
		vehicleInfo: '',
	});
	const [showVehicles, setShowVehicles] = useState(false);

	const handleChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			vehicleInfo: value,
			vehicleId: '',
		}));
		setShowVehicles(value.trim() !== '');
	};

	const handleSelect = ({ info }) => {
		setFormData({
			vehicleInfo: `${info?.vehicleNo} - ${info?.name}`,
			vehicleId: info?.id,
		});
		setVehicleId(info.id);
		setShowVehicles(false);
	};

	return (
		<div className="flex flex-col gap-2 relative">
			<Label title="Vehicle No." />
			<Input
				type="text"
				name="vehicleInfo"
				value={formData.vehicleInfo}
				onChange={handleChange}
				placeholder="Enter related vehicle No."
				autoComplete="off"
			/>

			{showVehicles && (
				<div className="absolute top-[7dvh] z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{vehicles
						.filter(vehicle =>
							(`${vehicle?.vehicleNo} - ${vehicle?.name}`)
								.toLowerCase()
								.includes(formData.vehicleInfo.toLowerCase())
						)
						.map(vehicle => (
							<div
								key={vehicle?.id}
								className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer border"
								onClick={() => handleSelect({ info: vehicle })}
							>
								<div>
									<p>{vehicle?.vehicleNo} - {vehicle?.name}</p>
								</div>
								{formData.vehicleId === vehicle.id && (
									<Check className="h-4 w-4 text-primary" />
								)}
							</div>
						))}
				</div>
			)}
		</div>
	)
}
