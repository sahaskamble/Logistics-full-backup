import { useState } from 'react';
import { DownloadIcon, Truck, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';

export default function Timeline({ movement }) {
	const [activeItem, setActiveItem] = useState(null);

	return (
		<div className="md:m-6 border rounded-xl p-6 bg-[var(--accent)] shadow-md shadow-foreground/40">
			<div className="flex text-2xl pb-10 items-center gap-2">
				<Truck size={25} />
				<Label title={'Shipment Progress'} />
			</div>
			<div className="max-w-3xl mx-auto">
				<div className="relative cursor-pointer">
					{/* Vertical timeline line */}
					<div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--primary)]"></div>

					{/* Timeline items */}
					{movement.map((item) => (
						<div
							key={item.id}
							className="relative flex gap-6 mb-12"
							onMouseEnter={() => setActiveItem(item.id)}
							onMouseLeave={() => setActiveItem(null)}
						>
							{/* Icon container */}
							<div className={`flex-shrink-0 z-10 w-12 h-12 flex items-center justify-center rounded-full 
								${activeItem === item.id ? 'bg-[var(--primary)]' : 'bg-[var(--background)] text-[var(--foreground)]'} border-2 transition-colors duration-300
							`}>
								<span className={`${activeItem === item.id ? 'text-[var(--background)]' : 'text-[var(--primary)]'}`}>
									<Check />
								</span>
							</div>

							{/* Content */}
							<div className="flex-grow pt-1">
								<div className="flex items-center gap-3 mb-1">
									<h3 className="text-lg font-bold ">{item?.status}</h3>
								</div>
								<p className="text-sm font-medium text-[var(--foreground)] mb-2">Released on {
									new Date(item.date).toLocaleDateString('en-US', {
										day: 'numeric',
										month: 'short',
										year: 'numeric',
									})
								}</p>
								<p className="text-sm text-[var(--foreground)] mb-3">{item?.remarks}</p>
								<Button
									title='Download Zip'
									icon={
										<DownloadIcon className='w-5 h-5' />
									}
									className='rounded-md'
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
