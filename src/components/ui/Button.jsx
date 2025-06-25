export default function Button({ variant, title, icon, iconPosition = 'left', className = '', textSize = 'text-base', onClick, displayText = true, disabled }) {
	const variantClass = buttonVariants({ variant });
	const icon_Position = IconPositionRenderer({ iconPosition })
	return (
		<button
			className={
				`flex ${icon_Position} items-center justify-center gap-2 px-3 py-2 transition-colors duration-300 
					${className} ${variantClass} ${disabled ? 'text-gray-500 border-gray-500 bg-opacity/50 cursor-not-allowed' : 'cursor-pointer'}
				`
			}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && icon}
			{displayText && <p className={textSize}>{title}</p>}
		</button>
	)
}

const buttonVariants = ({ variant }) => {
	switch (variant) {
		case 'destructive':
			return 'bg-red-700/70 text-background hover:bg-red-700 font-semibold';
		case 'outline':
			return 'border-2 border-foreground bg-background font-semibold';
		case 'outline-light':
			return 'border border-foreground bg-background';
		case 'outline-invert':
			return 'border border-background bg-primary text-background';
		case 'link':
			return 'border-b-2 border-foreground rounded-none font-semibold';
		case 'secondary':
			return 'bg-foreground/15 text-primary hover:bg-foreground/5 font-semibold';
		case 'invert':
			return 'text-primary bg-background hover:bg-background/90 font-semibold'
		case 'none':
			return ''

		default:
			return 'border-2 border-primary bg-primary text-background hover:bg-primary/90'
	}
}

const IconPositionRenderer = ({ iconPosition }) => {
	switch (iconPosition) {
		case 'left':
			return 'flex-row';
		case 'right':
			return 'flex-row-reverse';
		case 'top':
			return 'flex-col';
		case 'bottom':
			return 'flex-col-reverse'
	}
}

export function ButtonCard({ variant, title, icon, iconPosition = 'left', className = '', onClick, displayText = true }) {
	const variantClass = buttonVariants({ variant });
	const icon_Position = IconPositionRenderer({ iconPosition })
	return (
		<button
			className={
				`cursor-pointer flex ${icon_Position} items-center justify-center gap-2 p-3 transition-colors duration-300 font-semibold
					${className} ${variantClass}
				`
			}
			onClick={onClick}
		>
			{icon}
			{displayText && <p className="text-wrap">{title}</p>}
		</button>
	)
}
