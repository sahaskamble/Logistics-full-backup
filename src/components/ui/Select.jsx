import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

// Helper function for combining class names (simplified version of cn utility)
const cn = (...classes) => classes.filter(Boolean).join(" ")

export const Select = ({ children, value, onValueChange, disabled, placeholder = 'Select an option', className = '', allowBorders = true }) => {
	const [open, setOpen] = React.useState(false)
	const [selectedValue, setSelectedValue] = React.useState(value || "")

	const selectRef = React.useRef(null)
	const contentRef = React.useRef(null)

	// Handle selecting a value
	const handleSelect = (val) => {
		setSelectedValue(val)
		if (onValueChange) onValueChange(val)
		setOpen(false)
	}

	// Close dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	// Map children to get their props
	const options = React.Children.map(children, child => {
		if (child?.type?.displayName === "SelectItem") {
			return {
				value: child.props.value,
				children: child.props.children,
				disabled: child.props.disabled
			}
		}
		return null
	}).filter(Boolean)

	// Find selected item to display
	const selectedItem = options.find(option => option.value === selectedValue)

	return (
		<div className="relative" ref={selectRef}>
			<button
				type="button"
				className={`flex h-9 min-w-[200px] w-full items-center justify-between whitespace-nowrap rounded-md ${allowBorders ? 'border' : 'border-none'} border-input bg-[var(--accent)] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring
					${disabled && "cursor-not-allowed opacity-50"} ${className}`}
				onClick={() => !disabled && setOpen(!open)}
				disabled={disabled}
			>
				<span className="">
					{selectedItem ? selectedItem.children : placeholder}
				</span>
				{open ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}

			</button>

			{open && (
				<div
					ref={contentRef}
					className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md  border bg-[var(--accent)] shadow-md animate-in fade-in-0 zoom-in-95 mt-1"
				>
					<div className="p-1 max-h-60 overflow-auto">
						{options.map((option, index) => (
							<div
								key={index}
								className={cn(
									"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
									"hover:bg-[var(--primary)] hover:text-[var(--background)]",
									option.disabled && "pointer-events-none opacity-50"
								)}
								onClick={() => !option.disabled && handleSelect(option.value)}
							>
								<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
									{selectedValue === option.value && (
										<Check className="h-4 w-4" />
									)}
								</span>
								{option.children}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export const SelectItem = ({ value, children, disabled }) => {
	return null // This is just a data component
}
SelectItem.displayName = "SelectItem"
