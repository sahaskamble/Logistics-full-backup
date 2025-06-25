import React, { useState, useEffect, useRef } from 'react';

export const Popover = ({
	children,
	trigger,
	open: controlledOpen,
	onOpenChange,
	className,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dialogRef = useRef(null);
	const triggerRef = useRef(null);

	// Handle controlled vs uncontrolled state
	const isControlled = controlledOpen !== undefined;
	const openState = isControlled ? controlledOpen : isOpen;
	const handleOpenChange = (newOpen) => {
		if (isControlled) {
			onOpenChange?.(newOpen);
		} else {
			setIsOpen(newOpen);
		}
	};

	// Close dialog on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dialogRef.current &&
				!dialogRef.current.contains(event.target) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target)
			) {
				handleOpenChange(false);
			}
		};

		if (openState) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openState]);

	// Close dialog on Escape key
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && openState) {
				handleOpenChange(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [openState]);

	return (
		<div className="inline-block">
			<div
				ref={triggerRef}
				onClick={() => handleOpenChange(!openState)}
				className="inline-flex items-center justify-center cursor-pointer"
			>
				{trigger}
			</div>

			{openState && (
				<div className={`${className} absolute right-0 mt-2 z-50 origin-top-right`}>
					<div
						ref={dialogRef}
						role="dialog"
						className="bg-[var(--accent)] rounded-lg shadow-lg shadow-white ring-1 ring-[var(--foreground)] ring-opacity-5 overflow-hidden"
						style={{
							maxHeight: 'calc(100vh - 100px)',
							overflowY: 'auto'
						}}
					>
						{children}
					</div>
				</div>
			)}
		</div>
	);
};
