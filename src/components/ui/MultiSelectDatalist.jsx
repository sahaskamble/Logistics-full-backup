import { Check, ChevronDown, X } from "lucide-react";
import Badge from "./Badge";
import Label from "./Label";
import Button from "./Button";
import Input from "./Input";
import { useEffect, useRef, useState } from "react";


// Multi-Select Component
export default function MultiSelectDatalist({
	options = options ?? [],
	value = [],
	onValueChange,
	placeholder = "Select items...",
	searchPlaceholder = "Search...",
	emptyText = "No items found",
	maxDisplay = 3,
	getOptionLabel = (option) => option.label || option.name || String(option),
	getOptionValue = (option) => option.value || option.id || option,
	getOptionDescription = (option) => option.description,
	label,
	className = "",
	disabled = false,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const containerRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Filter options based on search and exclude already selected
	let filteredOptions = [];
	if (options?.length > 0) {
		console.log(options)
		filteredOptions = options.filter(option => {
			const optionLabel = getOptionLabel(option).toLowerCase();
			const optionValue = getOptionValue(option);
			const matchesSearch = optionLabel.includes(searchValue.toLowerCase());
			const notSelected = !value.includes(optionValue);
			return matchesSearch && notSelected;
		});
	}

	// Get selected option objects
	const selectedOptions = options.filter(option =>
		value.includes(getOptionValue(option))
	);

	const handleSelect = (option) => {
		const optionValue = getOptionValue(option);
		if (!value.includes(optionValue)) {
			onValueChange([...value, optionValue]);
		}
		setSearchValue("");
		setIsOpen(false);
	};

	const handleRemove = (optionValue) => {
		onValueChange(value.filter(v => v !== optionValue));
	};

	const handleClearAll = () => {
		onValueChange([]);
	};

	const displayedOptions = selectedOptions.slice(0, maxDisplay);
	const hiddenCount = selectedOptions.length - maxDisplay;

	return (
		<div className={`relative w-full ${className}`} ref={containerRef}>
			{label && <Label className="mb-2">{label}</Label>}

			{/* Selected Items Display */}
			{selectedOptions.length > 0 && (
				<div className="mb-2 flex flex-wrap gap-1">
					{displayedOptions.map(option => {
						const optionValue = getOptionValue(option);
						return (
							<Badge key={optionValue} variant="secondary" className="gap-1">
								<span className="max-w-32 truncate">{getOptionLabel(option)}</span>
								<button
									type="button"
									onClick={() => handleRemove(optionValue)}
									className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
									disabled={disabled}
								>
									<X className="h-5 w-5 cursor-pointer" />
								</button>
							</Badge>
						);
					})}

					{hiddenCount > 0 && (
						<Badge variant="outline">
							+{hiddenCount} more
						</Badge>
					)}

					{selectedOptions.length > 1 && (
						<Button
							variant="ghost"
							onClick={handleClearAll}
							className="rounded-lg max-h-6"
							disabled={disabled}
							title={'Clear all'}
							textSize="text-xs"
						/>
					)}
				</div>
			)}

			{/* Trigger Input */}
			<div className="relative">
				<Input
					type="text"
					placeholder={selectedOptions.length > 0 ? searchPlaceholder : placeholder}
					value={searchValue}
					onChange={(e) => {
						setSearchValue(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					className="pr-10 bg-accent"
					disabled={disabled}
				/>
				<div className="absolute inset-y-0 right-0 flex items-center pr-3">
					<ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
				</div>
			</div>

			{/* Dropdown */}
			{isOpen && !disabled && (
				<div className="absolute z-50 w-full mt-1 bg-background text-foreground border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{(filteredOptions.length === 0 && searchValue.trim()) ? (
						<div className="p-3 text-center text-sm text-muted-foreground">
							{searchValue ? emptyText : "No more items to select"}
						</div>
					) : (
						filteredOptions.map(option => {
							const optionValue = getOptionValue(option);
							const optionLabel = getOptionLabel(option);
							const optionDescription = getOptionDescription?.(option);

							return (
								<div
									key={optionValue}
									className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
									onClick={() => handleSelect(option)}
								>
									<div className="flex-1 min-w-0">
										<div className="font-medium text-sm">{optionLabel}</div>
										{optionDescription && (
											<div className="text-xs text-muted-foreground mt-0.5 truncate">
												{optionDescription}
											</div>
										)}
									</div>
									<div className="w-4 h-4 ml-2 border border-border rounded flex items-center justify-center">
										<Check className="h-3 w-3 opacity-0" />
									</div>
								</div>
							);
						})
					)}
				</div>
			)}

			{/* Selection Count */}
			{selectedOptions.length > 0 && (
				<div className="mt-2 text-xs text-muted-foreground">
					{selectedOptions.length} item{selectedOptions.length !== 1 ? 's' : ''} selected
				</div>
			)}
		</div>
	);
}
