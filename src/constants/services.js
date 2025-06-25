import { ArrowDown, Boxes, Container, CreditCard, FastForward, FileText, Forklift, LayoutGrid, MapPinned, Receipt, Scale, Scan, Ship, Truck, Warehouse } from "lucide-react";

export const servicesList = [
	{
		id: 'cfs',
		label: "CFS",
		icon: Container
	},
	{
		id: 'transport',
		label: "Transport",
		icon: Truck
	},
	{
		id: '3pl',
		label: "3PL",
		icon: Forklift
	},
	{
		id: 'warehouse',
		label: "Warehouse",
		icon: Container
	},
];

export const cfsServices = [
	{
		id: 'EIR / COP',
		title: 'EIR / COP',
		description: 'Equipment Interchange Receipt or Container Operational Permit',
		href: '/customer/cfs/services/eir-cop',
		icon: FileText,
	},
	{
		id: 'Priority Movement',
		title: 'Priority Movements',
		description: 'Priority handling for urgent container movements',
		href: '/customer/cfs/services/priority',
		icon: FastForward,
	},
	{
		id: 'Weightment Slip',
		title: 'Weighment Slip',
		description: 'Generate container weight measurement slips',
		href: '/customer/cfs/services/weighment-slip',
		icon: Scale,
	},
	{
		id: 'Special Equipments',
		title: 'Special Equipment',
		description: 'Specialized container handling equipment',
		href: '/customer/cfs/services/special-equipment',
		icon: LayoutGrid,
	},
	{
		id: 'Container Grounding',
		title: 'Container Grounding',
		description: 'Container grounding services',
		href: '/customer/cfs/services/container-grounding',
		icon: ArrowDown,
	},
	{
		id: 'Container Staging',
		title: 'Container Staging',
		description: 'Schedule container staging operations',
		href: '/customer/cfs/services/container-staging',
		icon: Boxes,
	},
	{
		id: 'Re-Scanning',
		title: 'Re-Scanning',
		description: 'Container re-scanning services',
		href: '/customer/cfs/services/rescan',
		icon: Scan,
	},
	{
		id: 'Cheque Acceptance',
		title: 'Cheque Acceptance',
		description: 'Submit cheque payments requests',
		href: '/customer/cfs/services/cheque',
		icon: CreditCard,
	},
	{
		id: 'Tax Invoice',
		title: 'Tax Invoice',
		description: 'Generate tax invoice for services',
		href: '/customer/cfs/services/tax-invoice',
		icon: Receipt,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/cfs/services/job-order',
		icon: FileText,
	},
];

export const warehouseServices = [
	{
		id: 'EIR / COP',
		title: 'EIR / COP',
		description: 'Equipment Interchange Receipt or Container Operational Permit',
		href: '/customer/warehouse/services/eir-cop',
		icon: FileText,
	},
	{
		id: 'Priority Movement',
		title: 'Priority Movements',
		description: 'Priority handling for urgent container movements',
		href: '/customer/warehouse/services/priority',
		icon: FastForward,
	},
	{
		id: 'Weightment Slip',
		title: 'Weighment Slip',
		description: 'Generate container weight measurement slips',
		href: '/customer/warehouse/services/weighment-slip',
		icon: Scale,
	},
	{
		id: 'Special Equipments',
		title: 'Special Equipment',
		description: 'Specialized container handling equipment',
		href: '/customer/warehouse/services/special-equipment',
		icon: LayoutGrid,
	},
	{
		id: 'Container Grounding',
		title: 'Container Grounding',
		description: 'Container grounding services',
		href: '/customer/warehouse/services/container-grounding',
		icon: ArrowDown,
	},
	{
		id: 'Container Staging',
		title: 'Container Staging',
		description: 'Schedule container staging operations',
		href: '/customer/warehouse/services/container-staging',
		icon: Boxes,
	},
	{
		id: 'Re-Scanning',
		title: 'Re-Scanning',
		description: 'Container re-scanning services',
		href: '/customer/warehouse/services/rescan',
		icon: Scan,
	},
	{
		id: 'Cheque Acceptance',
		title: 'Cheque Acceptance',
		description: 'Submit cheque payments requests',
		href: '/customer/warehouse/services/cheque',
		icon: CreditCard,
	},
	{
		id: 'Tax Invoice',
		title: 'Tax Invoice',
		description: 'Generate tax invoice for services',
		href: '/customer/warehouse/services/tax-invoice',
		icon: Receipt,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/warehouse/services/job-order',
		icon: FileText,
	},
];

export const transport_services = [
	{
		id: 'Transport Movement',
		title: 'Transport Movement',
		description: 'Track delivery of your order',
		href: '/customer/transport/services/eir-cop',
		icon: MapPinned,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/transport/services/job-order',
		icon: FileText,
	},
];

export const services_3pl = [
	{
		id: 'CFS',
		title: 'CFS',
		description: 'Temporary Storage Solutions for containers before customs',
		href: '/customer/3pl/services/cfs',
		icon: Ship,
	},
	{
		id: 'Warehouse',
		title: 'Warehouse',
		description: 'A Storage place before goods are to be imported / exported',
		href: '/customer/3pl/services/transport',
		icon: Warehouse,
	},
	{
		id: 'Transport',
		title: 'Transport',
		description: 'Live tracking using maps and information of order movement',
		href: '/customer/3pl/services/transport',
		icon: Truck,
	},
];

export const services_3pl_cfs = [
	{
		id: 'EIR / COP',
		title: 'EIR / COP',
		description: 'Equipment Interchange Receipt or Container Operational Permit',
		href: '/customer/3pl/services/cfs/eir-cop',
		icon: FileText,
	},
	{
		id: 'Priority Movement',
		title: 'Priority Movements',
		description: 'Priority handling for urgent container movements',
		href: '/customer/3pl/services/cfs/priority',
		icon: FastForward,
	},
	{
		id: 'Weightment Slip',
		title: 'Weighment Slip',
		description: 'Generate container weight measurement slips',
		href: '/customer/3pl/services/cfs/weighment-slip',
		icon: Scale,
	},
	{
		id: 'Special Equipments',
		title: 'Special Equipment',
		description: 'Specialized container handling equipment',
		href: '/customer/3pl/services/cfs/special-equipment',
		icon: LayoutGrid,
	},
	{
		id: 'Container Grounding',
		title: 'Container Grounding',
		description: 'Container grounding services',
		href: '/customer/3pl/services/cfs/container-grounding',
		icon: ArrowDown,
	},
	{
		id: 'Container Staging',
		title: 'Container Staging',
		description: 'Schedule container staging operations',
		href: '/customer/3pl/services/cfs/container-staging',
		icon: Boxes,
	},
	{
		id: 'Re-Scanning',
		title: 'Re-Scanning',
		description: 'Container re-scanning services',
		href: '/customer/3pl/services/cfs/rescan',
		icon: Scan,
	},
	{
		id: 'Cheque Acceptance',
		title: 'Cheque Acceptance',
		description: 'Submit cheque payments requests',
		href: '/customer/3pl/services/cfs/cheque',
		icon: CreditCard,
	},
	{
		id: 'Tax Invoice',
		title: 'Tax Invoice',
		description: 'Generate tax invoice for services',
		href: '/customer/3pl/services/cfs/tax-invoice',
		icon: Receipt,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/3pl/services/cfs/job-order',
		icon: FileText,
	},
];
export const services_3pl_warehouse = [
	{
		id: 'EIR / COP',
		title: 'EIR / COP',
		description: 'Equipment Interchange Receipt or Container Operational Permit',
		href: '/customer/3pl/services/warehouse/eir-cop',
		icon: FileText,
	},
	{
		id: 'Priority Movement',
		title: 'Priority Movements',
		description: 'Priority handling for urgent container movements',
		href: '/customer/3pl/services/warehouse/priority',
		icon: FastForward,
	},
	{
		id: 'Weightment Slip',
		title: 'Weighment Slip',
		description: 'Generate container weight measurement slips',
		href: '/customer/3pl/services/warehouse/weighment-slip',
		icon: Scale,
	},
	{
		id: 'Special Equipments',
		title: 'Special Equipment',
		description: 'Specialized container handling equipment',
		href: '/customer/3pl/services/warehouse/special-equipment',
		icon: LayoutGrid,
	},
	{
		id: 'Container Grounding',
		title: 'Container Grounding',
		description: 'Container grounding services',
		href: '/customer/3pl/services/warehouse/container-grounding',
		icon: ArrowDown,
	},
	{
		id: 'Container Staging',
		title: 'Container Staging',
		description: 'Schedule container staging operations',
		href: '/customer/3pl/services/warehouse/container-staging',
		icon: Boxes,
	},
	{
		id: 'Re-Scanning',
		title: 'Re-Scanning',
		description: 'Container re-scanning services',
		href: '/customer/3pl/services/warehouse/rescan',
		icon: Scan,
	},
	{
		id: 'Cheque Acceptance',
		title: 'Cheque Acceptance',
		description: 'Submit cheque payments requests',
		href: '/customer/3pl/services/warehouse/cheque',
		icon: CreditCard,
	},
	{
		id: 'Tax Invoice',
		title: 'Tax Invoice',
		description: 'Generate tax invoice for services',
		href: '/customer/3pl/services/warehouse/tax-invoice',
		icon: Receipt,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/3pl/services/warehouse/job-order',
		icon: FileText,
	},
];

export const services_3pl_transport = [
	{
		id: 'Transport Movement',
		title: 'Transport Movement',
		description: 'Track delivery of your order',
		href: '/customer/transport/services/eir-cop',
		icon: MapPinned,
	},
	{
		id: 'Job Order Update',
		title: 'Job Order Update',
		description: 'Modify existing job orders',
		href: '/customer/transport/services/job-order',
		icon: FileText,
	},
];
