export const user = {
	id: 'USER-001',
	companyName: 'Red Ocean Logistics Pvt. Ltd.',
	name: 'Rahul Mehta',
	email: 'rahul@redoceanlogistics.com',
	phone: '9876543210',
	gstin: '27AAACI1234J1Z1',
	address: 'Plot no. 7, Navi Mumbai, MH',
};

export const userDocuments = [
	{
		userId: 'USER-001',
		documentName: 'Aadhar Card',
		uploadedOn: '1 January 2023',
		url: '/user/aadhar-card.jpg'
	},
	{
		userId: 'USER-001',
		documentName: 'Pan Card',
		uploadedOn: '1 January 2023',
		url: '/user/pan-card.jpg'
	}
];

export const requiredDocuments = [
	'Handling Charges Sheet (PDF/Excel)',
	'Storage Terms & Conditions',
	'Safety and Hazard Policy',
	'Empty Return Guidelines (if applicable)',
	'Transportation Tariff Document',
	'GST Certificate (if not provided in profile)',
	'Aadhar Card',
	'Pan Card',
];
