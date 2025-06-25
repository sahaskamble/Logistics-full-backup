import RootClientLayout from "../components/RootClientLayout";

export default function RootLayout({ children }) {
	return (
		<RootClientLayout>
			<main>
				{children}
			</main>
		</RootClientLayout>
	);
}
