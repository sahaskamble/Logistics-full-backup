import RootGOLLayout from "./components/RootGOLLayout";

export default function RootLayout({ children }) {
	return (
		<RootGOLLayout>
			<main>
				{children}
			</main>
		</RootGOLLayout>
	);
}
