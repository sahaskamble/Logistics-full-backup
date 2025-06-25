import { requiredDocuments } from "@/constants/user";
import { Info } from "lucide-react";

export default function RequiredDocuments() {
	return (
		<div className="bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA] p-4 w-full rounded-xl shadow-md shadow-foreground/40">
			<div className="flex items-center gap-2 pb-2">
				<Info className="w-7 h-7" />
				<h1 className="text-xl font-semibold">Required Documents</h1>
			</div>
			{
				requiredDocuments.map((document) => (
					<p key={document} className="py-1"> -  {document} </p>
				))
			}
		</div>
	)
}

