import React, { useEffect, useRef } from 'react';

const RangeSlider = ({
	min,
	max,
	value,
	onChange,
	className = ""
}) => {
	const inputRef = useRef(null);

	// Update the background color whenever the value changes
	useEffect(() => {
		updateRangeBackground();
	}, [value]);

	// Calculate and set the background gradient
	const updateRangeBackground = () => {
		if (!inputRef.current) return;

		const rangeInput = inputRef.current;
		const percentage = ((value - min) / (max - min)) * 100;

		rangeInput.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, transparent ${percentage}%, transparent 100%)`
	};

	// Handler for the change event
	const handleChange = (e) => {
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<input
			ref={inputRef}
			type="range"
			min={min}
			max={max}
			value={value}
			onChange={handleChange}
			className={`w-full h-2 rounded-full border appearance-none cursor-pointer ${className}`}
			style={{
				// Remove default track styling
				background: 'transparent',
				// Customize the thumb appearance
				WebkitAppearance: 'none',
				appearance: 'none'
			}}
		/>
	);
};

export default RangeSlider;
