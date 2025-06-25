import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import Button from './Button';

// Context for dropdown state management
const DropdownContext = createContext({});

// Utility function to combine class names (replacing cn from utils)
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Main dropdown component
const DropdownMenu = ({ children, onOpenChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [subMenus, setSubMenus] = useState({});

	const handleOpenChange = (open) => {
		setIsOpen(open);
		if (onOpenChange) onOpenChange(open);
		if (!open) {
			setSubMenus({});
		}
	};

	return (
		<DropdownContext.Provider value={{
			isOpen,
			setIsOpen: handleOpenChange,
			subMenus,
			setSubMenus
		}}>
			<div className="relative inline-block">
				{children}
			</div>
		</DropdownContext.Provider>
	);
};

// Trigger component
const DropdownMenuTrigger = ({ title, icon, className, ...props }) => {
	const { isOpen, setIsOpen } = useContext(DropdownContext);
	const triggerRef = useRef(null);

	const handleClick = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setIsOpen(!isOpen);
		} else if (e.key === 'Escape') {
			setIsOpen(false);
		}
	};

	return (
		<Button
			ref={triggerRef}
			onClick={handleClick}
			variant={'outline-light'}
			title={title}
			icon={icon}
			iconPosition='right'
			onKeyDown={handleKeyDown}
			className={'rounded-md'}
			aria-expanded={isOpen}
			aria-haspopup="menu"
			{...props}
		/>
	);
};

// Content component
const DropdownMenuContent = ({ children, className, sideOffset = 4, ...props }) => {
	const { isOpen, setIsOpen } = useContext(DropdownContext);
	const contentRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event) => {
			if (contentRef.current && !contentRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, setIsOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={contentRef}
			className={cn(
				"absolute top-full z-50 min-w-64 overflow-hidden rounded-md border p-1 bg-background shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
				className
			)}
			style={{ marginTop: `${sideOffset}px` }}
			role="menu"
			{...props}
		>
			{children}
		</div>
	);
};

// Menu item component
const DropdownMenuItem = ({ children, className, inset, onClick, disabled, ...props }) => {
	const { setIsOpen } = useContext(DropdownContext);

	const handleClick = (e) => {
		if (disabled) return;
		if (onClick) onClick(e);
		setIsOpen(false);
	};

	const handleKeyDown = (e) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(e);
		}
	};

	return (
		<div
			role="menuitem"
			tabIndex={disabled ? -1 : 0}
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-gray-100",
				inset && "pl-8",
				disabled && "pointer-events-none opacity-50",
				className
			)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			{...props}
		>
			{children}
		</div>
	);
};

// Checkbox item component
const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange, className, disabled, ...props }) => {
	const { setIsOpen } = useContext(DropdownContext);

	const handleClick = (e) => {
		if (disabled) return;
		if (onCheckedChange) onCheckedChange(!checked);
	};

	const handleKeyDown = (e) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(e);
		}
	};

	return (
		<div
			role="menuitemcheckbox"
			aria-checked={checked}
			tabIndex={disabled ? -1 : 0}
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
				disabled && "pointer-events-none opacity-50",
				className
			)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				{checked && <Check className="h-4 w-4" />}
			</span>
			{children}
		</div>
	);
};

// Radio group context
const RadioGroupContext = createContext({});

// Radio group component
const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => {
	return (
		<RadioGroupContext.Provider value={{ value, onValueChange }}>
			<div role="radiogroup">
				{children}
			</div>
		</RadioGroupContext.Provider>
	);
};

// Radio item component
const DropdownMenuRadioItem = ({ children, value, className, disabled, ...props }) => {
	const { value: groupValue, onValueChange } = useContext(RadioGroupContext);
	const { setIsOpen } = useContext(DropdownContext);
	const isSelected = groupValue === value;

	const handleClick = (e) => {
		if (disabled) return;
		if (onValueChange) onValueChange(value);
	};

	const handleKeyDown = (e) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(e);
		}
	};

	return (
		<div
			role="menuitemradio"
			aria-checked={isSelected}
			tabIndex={disabled ? -1 : 0}
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
				disabled && "pointer-events-none opacity-50",
				className
			)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				{isSelected && <Circle className="h-2 w-2 fill-current" />}
			</span>
			{children}
		</div>
	);
};

// Label component
const DropdownMenuLabel = ({ className, inset, children, ...props }) => {
	return (
		<div
			className={cn("px-2 py-1.5 text-sm font-semibold text-gray-900", inset && "pl-8", className)}
			{...props}
		>
			{children}
		</div>
	);
};

// Separator component
const DropdownMenuSeparator = ({ className, ...props }) => {
	return (
		<div
			className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
			role="separator"
			{...props}
		/>
	);
};

// Shortcut component
const DropdownMenuShortcut = ({ className, children, ...props }) => {
	return (
		<span
			className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
			{...props}
		>
			{children}
		</span>
	);
};

// Group component (just a wrapper)
const DropdownMenuGroup = ({ children }) => {
	return <div role="group">{children}</div>;
};

// Sub menu components
const DropdownMenuSub = ({ children }) => {
	const [isSubOpen, setIsSubOpen] = useState(false);
	return (
		<DropdownContext.Provider value={{ isSubOpen, setIsSubOpen }}>
			<div className="relative">
				{children}
			</div>
		</DropdownContext.Provider>
	);
};

const DropdownMenuSubTrigger = ({ children, className, inset, ...props }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className={cn(
				"flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
				inset && "pl-8",
				className
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			{...props}
		>
			{children}
			<ChevronRight className="ml-auto h-4 w-4" />
		</div>
	);
};

const DropdownMenuSubContent = ({ children, className, ...props }) => {
	return (
		<div
			className={cn(
				"absolute left-full top-0 z-50 min-w-32 overflow-hidden rounded-md border bg-background p-1 shadow-lg ml-1",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

// Portal component (simplified - just renders children)
const DropdownMenuPortal = ({ children }) => children;

// Demo component to show usage
const DropdownMenuDemo = () => {
	const [checkboxStates, setCheckboxStates] = useState({
		item1: false,
		item2: true,
		item3: false
	});

	const [radioValue, setRadioValue] = useState('option1');

	return (
		<div className="p-8 space-y-4">
			<h2 className="text-2xl font-bold mb-4">Dropdown Menu Demo</h2>

			<DropdownMenu>
				<DropdownMenuTrigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					Open Menu
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuCheckboxItem
							checked={checkboxStates.item1}
							onCheckedChange={(checked) =>
								setCheckboxStates(prev => ({ ...prev, item1: checked }))
							}
						>
							Show Toolbar
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={checkboxStates.item2}
							onCheckedChange={(checked) =>
								setCheckboxStates(prev => ({ ...prev, item2: checked }))
							}
						>
							Show Sidebar
						</DropdownMenuCheckboxItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
						<DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="option3">Option 3</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default DropdownMenuDemo;

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};
