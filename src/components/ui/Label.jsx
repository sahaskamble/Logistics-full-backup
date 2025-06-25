export default function Label({ title, ariaLabel = '', className = '' }) {
	return (
		<label className={`font-semibold ${className}`} aria-label={ariaLabel}>{title}</label>
	)
}

