import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { taxInvoices } from "@/constants/cfs/tax-invoice";
import { Check } from "lucide-react";
import { useState } from "react";

export default function InvoiceInput({ setInvoiceId }) {
	const [formData, setFormData] = useState({
		invoiceId: '',
		invoiceInfo: '',
	});
	const [showInvoices, setShowInvoices] = useState(false);

	const handleChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			invoiceInfo: value,
			invoiceId: '',
		}));
		setShowInvoices(value.trim() !== '');
	};

	const handleSelectInvoice = ({ info }) => {
		setFormData({
			invoiceInfo: `${info.id} - ${info.consigneeName} -  ${info.invoiceNo}`,
			invoiceId: info.id,
		});
		setInvoiceId(info.id);
		setShowInvoices(false);
	};

	return (
		<div className="flex flex-col gap-2 relative">
			<Label title="Invoice ID" />
			<Input
				type="text"
				name="invoiceInfo"
				value={formData.invoiceInfo}
				onChange={handleChange}
				placeholder="Enter related Invoice Id"
				autoComplete="off"
			/>

			{showInvoices && (
				<div className="absolute top-[7dvh] z-10 w-full mt-1 bg-white binvoice rounded-md shadow-lg max-h-60 overflow-y-auto">
					{taxInvoices
						.filter(invoice =>
							(`${invoice.id} - ${invoice.consigneeName} - ${invoice.invoiceNo}`)
								.toLowerCase()
								.includes(formData.invoiceInfo.toLowerCase())
						)
						.map(invoice => (
							<div
								key={invoice.id}
								className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer binvoice"
								onClick={() => handleSelectInvoice({ info: invoice })}
							>
								<div>
									<h1>{invoice.id}</h1>
									<p>{invoice.consigneeName}</p>
									<p>{invoice.invoiceNo}</p>
								</div>
								{formData.invoiceId === invoice.id && (
									<Check className="h-4 w-4 text-primary" />
								)}
							</div>
						))}
				</div>
			)}
		</div>
	)
}
