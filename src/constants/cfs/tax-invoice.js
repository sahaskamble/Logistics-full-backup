export const taxInvoices = [
	{
		id: 'TI-001',
		order: {
			id: 'ORD-001',
			cfs: {
				id: 'chennai-cfs',
				title: "Chennai Port CFS",
				location: "Chennai Port, Tamil Nadu",
			},
		},
		jobOrderId: 'JO-005',
		from: '10 January 2024',
		to: '20 January 2024',
		invoiceNo: 'CFS/EXP/2300001',
		consigneeName: 'ABC Shipping Pvt Ltd',
		chaName: 'Himatlal Shah & Co.',
		gstin: '27AAECA6247N1ZA',
		date: '21 January 2024',
		subTotal: 9700,
		gstTotal: 300,
		grossTotal: 10000,
		paymentMode: 'Cheque',
		remarks: 'Awaiting cheque payment',
		status: 'In Progress',
		files: [
			{ path: '' }
		]
	},
]
