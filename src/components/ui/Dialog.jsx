import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Dialog = ({
	children,
	trigger,
	title,
	description,
	open: controlledOpen,
	onOpenChange,
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
		<>
			<div
				ref={triggerRef}
				onClick={() => handleOpenChange(true)}
				className="inline-flex items-center justify-center"
			>
				{trigger}
			</div>
			{openState && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-lg transition-opacity duration-200"
						style={{ opacity: openState ? 1 : 0 }}
					/>
					{/* Dialog Content */}
					<div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby={title ? 'dialog-title' : undefined}
						aria-describedby={description ? 'dialog-description' : undefined}
						className="relative bg-[var(--background)] rounded-lg shadow-xl w-auto mx-4 max-h-[70vh] flex flex-col transform transition-all duration-200 ease-out"
						style={{
							opacity: openState ? 1 : 0,
							transform: openState ? 'scale(1)' : 'scale(0.95)',
						}}
					>
						{/* Header */}
						{(title || description) && (
							<div className="p-6 border-b flex-shrink-0">
								{title && (
									<h2 id="dialog-title" className="text-lg font-semibold">
										{title}
									</h2>
								)}
								{description && (
									<p id="dialog-description" className="mt-1 text-sm">
										{description}
									</p>
								)}
							</div>
						)}
						{/* Content - This is the scrollable area */}
						<div className="p-6 overflow-y-auto">
							{children}
						</div>
						{/* Close Button */}
						<button
							onClick={() => handleOpenChange(false)}
							className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer"
							aria-label="Close dialog"
						>
							<X className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>
			)}
		</>
	);
};
