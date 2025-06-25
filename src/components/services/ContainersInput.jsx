import { useCollection } from "@/hooks/useCollection";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ContainersInput({
	selectedContainers,
	setSelectedContainers,
	filteredContainers,
	displayContainers,
	setDisplayContainers
}) {
	const { createItem: addContainer, mutation: updateContainers } = useCollection('containers');
	const { user } = useAuth();

	const [showContainersSuggestions, setShowContainersSuggestions] = useState(false);
	const [containerInput, setContainerInput] = useState({
		ownedBy: "",
		containerNo: "",
		size: "20 ft",
		status: "Busy",
		cargoType: "",
	});

	//	** -- Helper Functions -- **

	// Input Change
	const handleContainerInput = (e) => {
		const { name, value } = e.target;
		setContainerInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	// Clear All
	const handleClearAll = (e) => {
		e.preventDefault();
		setSelectedContainers([]);
		setDisplayContainers([]);
	}

	// Container Select
	const handleContainerSelect = (container) => {
		if (!selectedContainers?.find((cont) => cont === container?.id)) {
			setSelectedContainers(prev => [...prev, container?.id]);
			setDisplayContainers(prev => [...prev, `${container?.containerNo} - ${container?.size}`]);
		}
		setContainerInput({
			ownedBy: "",
			containerNo: "",
			size: "20 ft",
			status: "Busy",
			cargoType: "",
		});
		setShowContainersSuggestions(false);
	};

	// Add New Container
	const createNewContainer = async (e) => {
		e.preventDefault();
		try {
			const newContainer = await addContainer({
				ownedBy: user?.id,
				containerNo: containerInput.containerNo,
				size: containerInput.size,
				status: containerInput.status,
				cargoType: containerInput.cargoType,
			});
			setContainerInput({
				ownedBy: "",
				containerNo: "",
				size: "20 ft",
				status: "Busy",
				cargoType: "",
			});
			console.log(newContainer);
			setSelectedContainers(prev => [...prev, newContainer?.id]);
			setDisplayContainers(prev => [...prev, `${newContainer?.containerNo} - ${newContainer?.size}`]);
		} catch (error) {
			console.log(error)
			toast.error(error.message);
		} finally {
			setShowContainersSuggestions(false);
			updateContainers();
		}
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-4">
			{/* Display Selected Containers */}
			{displayContainers?.length > 0 && (
				<div className="flex flex-wrap gap-1 md:col-span-2">
					{displayContainers
						.slice(0, 2)
						.map(option => {
							return (
								<Badge key={option} variant="secondary" className="gap-1">
									<span className="max-w-32 truncate">{option}</span>
								</Badge>
							);
						})}

					{displayContainers?.length > 2 && (
						<Badge variant="outline">
							+{displayContainers?.length - 2} more
						</Badge>
					)}

					{displayContainers?.length > 1 && (
						<Button
							variant="ghost"
							onClick={handleClearAll}
							className="rounded-lg max-h-8"
							title={'Clear all'}
							textSize="text-sm"
						/>
					)}
				</div>
			)}

			<div className='flex flex-col gap-2'>
				<Label title={'Containers'} />
				<div className="relative">
					<Input
						id="containerNo"
						value={containerInput.containerNo}
						onChange={(e) => {
							setContainerInput(prev => ({
								...prev,
								containerNo: e.target.value
							}));
							setShowContainersSuggestions(true);
						}}
						className="pr-8"
						placeholder='eg; Enter Container No.'
					/>
					<Search className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />

					{/* Container suggestions dropdown */}
					{showContainersSuggestions && containerInput.containerNo && filteredContainers?.length > 0 && (
						<div className="absolute z-10 w-full mt-1 border rounded-md bg-background shadow-lg overflow-hidden">
							{filteredContainers
								.filter((container) => container?.containerNo?.includes(containerInput.containerNo))
								.map(container => (
									<div
										key={container?.id}
										className="p-2 hover:bg-accent cursor-pointer"
										onClick={() => handleContainerSelect(container)}
									>
										<p>{container?.containerNo} - {container?.size}</p>
									</div>
								))}
						</div>
					)}
				</div>
			</div>

			{(showContainersSuggestions && containerInput.containerNo && filteredContainers?.length > 0) && (
				<>
					{
						!(filteredContainers.find((container) => container?.containerNo?.includes(containerInput.containerNo))) && (
							<>
								<div className="flex flex-col gap-2 relative">
									<Label title="Container Size" />
									<Input
										type="text"
										name="size"
										value={containerInput.size}
										onChange={handleContainerInput}
										placeholder="eg; 20 ft, 40 ft"
										className="bg-accent"
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<Label title={'Cargo Type'} />
									<Input
										type="text"
										name="cargoType"
										value={containerInput.cargoType}
										onChange={handleContainerInput}
										placeholder="eg; Dry, Liquid, etc."
										className="bg-accent"
									/>
								</div>
								<Button
									className="col-span-2 rounded-xl"
									title={'Add Container'}
									icon={<Plus />}
									iconPosition="right"
									onClick={createNewContainer}
								/>
							</>
						)
					}
				</>
			)}
		</div>
	)
};
