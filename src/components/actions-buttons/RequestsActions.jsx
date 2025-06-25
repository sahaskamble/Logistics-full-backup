import React from 'react'
import { Popover } from '../ui/Popover'
import { CircleCheckBig, EllipsisVertical, Eye, Trash } from 'lucide-react'
import Button from '../ui/Button';

export default function RequestsActions({ row, RejectForm, user, EditForm, deleteItem, handleStatusUpdate }) {
	return (
		<Popover
			trigger={<EllipsisVertical className="w-4 h-4" />}
			className='min-h-[100px] p-4'
		>
			<h1 className='bg-secondary text-white p-2'>Actions</h1>

			<Button
				variant={'none'}
				icon={
					<Eye
						size={18}
						className="cursor-pointer text-primary"
					/>
				}
				iconPosition='right'
				title={'View Details'}
				onClick={() => console.log('View details for', row.original.id)}
			/>
			<EditForm info={row.original} />
			<Trash
				size={18}
				className="cursor-pointer text-primary"
				onClick={async () => {
					console.log('Delete details for', row.original.id);
					const confirmation = confirm('Are you sure you want to delete this entry?');
					if (confirmation) {
						await deleteItem(row.original.id);
					}
				}}
			/>
			{
				(user?.role === 'Root') && (
					<>
						<CircleCheckBig
							size={18}
							className="cursor-pointer text-primary"
							onClick={() => handleStatusUpdate(
								row.original.id,
								'Accepted'
							)}
						/>
						<RejectForm info={row.original} />
					</>
				)
			}
		</Popover>
	)
}

