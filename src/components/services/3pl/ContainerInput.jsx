import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { Check } from "lucide-react";
import { useState } from "react";

export default function ContainerInput({ setContainerId }) {
	const { data: containers } = useCollection('containers');

	const [formData, setFormData] = useState({
		containerId: '',
		containerInfo: '',
	});
	const [showContainers, setShowContainers] = useState(false);

	const handleChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			containerInfo: value,
			containerId: '',
		}));
		setShowContainers(value.trim() !== '');
	};

	const handleSelect = ({ info }) => {
		setFormData({
			containerInfo: `${info?.containerNo}`,
			containerId: info?.id,
		});
		setContainerId(info.id);
		setShowContainers(false);
	};

	return (
		<div className="flex flex-col gap-2 relative">
			<Label title="Container No." />
			<Input
				type="text"
				name="containerInfo"
				value={formData.containerInfo}
				onChange={handleChange}
				placeholder="Enter related Container No."
				autoComplete="off"
			/>

			{showContainers && (
				<div className="absolute top-[7dvh] z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{containers
						.filter(container =>
							(`${container?.containerNo}`)
								.toLowerCase()
								.includes(formData.containerInfo.toLowerCase())
						)
						.map(container => (
							<div
								key={container?.id}
								className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer border"
								onClick={() => handleSelect({ info: container })}
							>
								<div>
									<p>{container?.containerNo}</p>
								</div>
								{formData.containerId === container.id && (
									<Check className="h-4 w-4 text-primary" />
								)}
							</div>
						))}
				</div>
			)}
		</div>
	)
}
