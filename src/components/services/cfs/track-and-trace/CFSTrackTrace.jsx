import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { useState } from "react";
import OrderDetails from "./OrderDetails";
import Timeline from "./Timeline";
import Button from "@/components/ui/Button";
import { Truck } from "lucide-react";

export default function CFSTrackTrace() {
	const [order, setOrder] = useState({});
	const [movements, setMovements] = useState([]);

	const { data: orders } = useCollection('cfs_orders', {
		expand: 'cfs,containers'
	});
	const { data: movements_ } = useCollection('cfs_order_movement', {
		expand: 'order'
	});

	const [formData, setFormData] = useState({
		containerNo: '',
		orderId: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleTrack = () => {
		console.log(orders);
		const filtered = orders.find(order => {
			let matchesContainer = false, matchesOrderId = false;

			console.log(order);
			if (formData.containerNo !== '') {
				order?.expand?.containers?.map((container) => (
					matchesContainer = container.containerNo === formData.containerNo
				))
			}
			if (formData.orderId !== '') {
				matchesOrderId = order.id === formData.orderId;
			}
			return matchesContainer || matchesOrderId;
		});
		console.log(filtered)
		if (filtered?.id) {
			setMovements(movements_.filter((movement) => movement?.order === filtered?.id))
			setOrder(filtered);
		} else {
			setOrder({})
		}
	};

	return (
		<section className="grid gap-8 w-full">
			<div className="md:m-6 block items-center border border-green-900 rounded-lg bg-[var(--accent)] shadow-md shadow-foreground/40">
				<div className="p-5">
					<h1 className="text-2xl font-semibold">Container Tracking</h1>
				</div>
				<div className="p-2 grid md:grid-cols-2 grid-cols-1 text-black">
					<div className="mx-3 my-2">
						<Label className="text-foreground" title={'Container Number'} />
						<Input
							placeholder='Enter Container Number'
							name="containerNo"
							value={formData.containerNo}
							onChange={handleChange}
						/>
					</div>
					<div className="mx-3 my-2">
						<Label className="text-foreground" title={'Order Id'} />
						<Input
							placeholder='Enter Order Id'
							name="orderId"
							value={formData.orderId}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="p-5 flex justify-end">
					<Button
						className="rounded-[6px]"
						icon={<Truck />}
						title={'Track Status'}
						onClick={handleTrack}
					/>
				</div>
			</div>
			{order?.id && (
				<>
					<OrderDetails order={order} movement={movements} />
					<Timeline movement={movements} />
				</>
			)}
		</section>
	)
}

