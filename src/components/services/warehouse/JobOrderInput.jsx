import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function JobOrderInput({ setOrderId }) {
	const { data } = useCollection('warehouse_job_order', {
		expand: 'serviceType,order,order.provider'
	});

	const [formData, setFormData] = useState({
		orderId: '',
		orderInfo: '',
	});
	const { user } = useAuth();
	const [filteredJobOrders, setFilteredJobOrders] = useState([]);
	const [showOrders, setShowOrders] = useState(false);

	const handleChange = (e) => {
		const { value } = e.target;
		setFormData((prev) => ({
			...prev,
			orderInfo: value,
			orderId: '',
		}));
		setShowOrders(value.trim() !== '');
	};

	const handleSelectOrder = ({ info }) => {
		setFormData({
			orderInfo: `${info?.id} - ${info?.expand?.order?.consigneeName} -  ${info?.expand?.serviceType?.title}`,
			orderId: info?.id,
		});
		setOrderId(info.id);
		setShowOrders(false);
	};

	useEffect(() => {
		if (data?.length > 0 && user?.id) {
			let filtered_data = [];
			switch (user?.role) {
				case 'Customer':
					filtered_data = data.filter((item) => item?.expand?.order?.customer === user?.id);
					break;
				case 'Root':
					filtered_data = data;
					break;
				case 'Merchant':
					filtered_data = data.filter((item) => item?.expand?.order?.expand?.provider?.author === user?.id);
					break;
				default:
					break;
			}
			setFilteredJobOrders(filtered_data);
		}
	}, [data, user]);

	return (
		<div className="flex flex-col gap-2 relative">
			<Label title="Job Order ID" />
			<Input
				type="text"
				name="orderInfo"
				value={formData.orderInfo}
				onChange={handleChange}
				placeholder="Enter related Job Order Id"
				autoComplete="off"
			/>

			{showOrders && (
				<div className="absolute top-[7dvh] z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{filteredJobOrders
						.filter(order =>
							(`${order?.id} - ${order?.expand?.order?.consigneeName} -  ${order?.expand?.serviceType?.title}`)
								.toLowerCase()
								.includes(formData.orderInfo.toLowerCase())
						)
						.map(order => (
							<div
								key={order?.id}
								className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer border"
								onClick={() => handleSelectOrder({ info: order })}
							>
								<div>
									<h1>{order?.id}</h1>
									<p>{order?.expand?.order?.consigneeName}</p>
									<p>{order?.expand?.serviceType?.title}</p>
								</div>
								{formData.orderId === order.id && (
									<Check className="h-4 w-4 text-primary" />
								)}
							</div>
						))}
				</div>
			)}
		</div>
	)
}
