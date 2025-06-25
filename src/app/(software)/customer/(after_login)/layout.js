import RootCustomerLayout from "./components/RootCustomerLayout";

export default function RootLayout({ children }) {
	return (
		<RootCustomerLayout>
			<main>
				{children}
			</main>
		</RootCustomerLayout>
	);
}
