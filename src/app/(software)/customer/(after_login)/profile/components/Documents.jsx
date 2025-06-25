import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { DataTable } from "@/components/ui/Table";
import { userDocuments } from "@/constants/user"
import { useIsMobile } from "@/hooks/use-mobile";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

const columns = [
	{
		id: 'uploadedOn',
		accessorKey: 'uploadedOn',
		header: 'Uploaded On',
		filterable: true,
		cell: ({ row }) => <div>{row.original.uploadedOn}</div>,
	},
	{
		id: 'documentName',
		accessorKey: 'documentName',
		header: 'Document Name',
		filterable: true,
		cell: ({ row }) => <div>{row.original.documentName}</div>,
	},
	{
		id: 'actions',
		accessorKey: 'actions',
		header: 'Actions',
		filterable: false,
		cell: ({ row }) => (
			<div className="inline-flex justify-center items-center">
				<Download
					className="cursor-pointer text-[var(--primary)]"
					onClick={() => {
						const link = document.createElement('a');
						const url = row.original.url
						link.setAttribute('href', url)
						link.setAttribute('download', url)
						link.style.visibility = 'hidden'
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)
					}}
				/>
			</div>
		),
	},
]

export default function Documents() {

	const downloadFile = (url) => {
		const link = document.createElement('a');
		link.setAttribute('href', url)
		link.setAttribute('download', url)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<div className="border rounded-xl p-4 bg-[var(--accent)] shadow-md shadow-foreground/40">
			<h1 className="text-xl font-semibold">View & Manage Documents</h1>
			{useIsMobile() ? (
				<div className="grid gap-4 pt-6">
					{
						userDocuments.map((document, index) => (
							<div key={index} className="border rounded-xl p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="flex flex-col text-sm">
										<h1 className="font-semibold">{document.documentName}</h1>
										<p>Uploaded on: {document.uploadedOn}</p>
									</div>
									<Download className="cursor-pointer text-[var(--primary)] w-4 h-4" onClick={() => downloadFile(document.url)} />
								</div>
							</div>
						))
					}
				</div>
			) : <DataTable columns={columns} data={userDocuments} />}
		</div>
	)
}

