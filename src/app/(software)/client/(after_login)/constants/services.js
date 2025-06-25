import { ArrowDown, Boxes, CreditCard, FastForward, FileText, LayoutGrid, Receipt, Scale, Scan, } from "lucide-react";

export const cfsServices = [
	{
		title: 'EIR / COP Request',
		description: 'Request Equipment Interchange Receipt or Container Operational Permit',
		href: '/client/cfs/services/eir-cop',
		icon: FileText,
	},
	{
		title: 'Priority Movements Request',
		description: 'Request priority handling for urgent container movements',
		href: '/client/cfs/services/priority',
		icon: FastForward,
	},
	{
		title: 'Weighment Slip Request',
		description: 'Generate container weight measurement slips',
		href: '/client/cfs/services/weighment-slip',
		icon: Scale,
	},
	{
		title: 'Special Equipment Request',
		description: 'Request specialized container handling equipment',
		href: '/client/cfs/services/special-equipment',
		icon: LayoutGrid,
	},
	{
		title: 'Container Grounding',
		description: 'Request container grounding services',
		href: '/client/cfs/services/container-grounding',
		icon: ArrowDown,
	},
	{
		title: 'Container Staging Request',
		description: 'Schedule container staging operations',
		href: '/client/cfs/services/container-staging',
		icon: Boxes,
	},
	{
		title: 'Re-Scanning Request',
		description: 'Request container re-scanning services',
		href: '/client/cfs/services/rescan',
		icon: Scan,
	},
	{
		title: 'Cheque Acceptance',
		description: 'Submit cheque payments requests',
		href: '/client/cfs/services/cheque',
		icon: CreditCard,
	},
	{
		title: 'Tax Invoice Request',
		description: 'Generate tax invoice for services',
		href: '/client/cfs/services/tax-invoice',
		icon: Receipt,
	},
	{
		title: 'Job Order Update Request',
		description: 'Modify existing job orders',
		href: '/client/cfs/services/job-order',
		icon: FileText,
	},
];
