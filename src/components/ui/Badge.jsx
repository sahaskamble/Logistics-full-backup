export default function Badge({ variant = "default", className = "", children, ...props }) {
	const variants = {
		default: "bg-primary text-background hover:bg-primary/80",
		secondary: "bg-accent text-foreground hover:bg-accent/80",
		outline: "text-foreground border border-foreground bg-background hover:bg-background/80",
	};

	return (
		<div
			className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

