import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { user } from "@/constants/user"
import { useEffect, useState } from "react";

export default function Profile() {

	const [userInfo, setUserInfo] = useState({
		companyName: '',
		name: '',
		email: '',
		phone: '',
		gstin: '',
		address: '',
	});

	useEffect(() => {
		if (user.id) {
			setUserInfo({
				companyName: user.companyName,
				name: user.name,
				email: user.email,
				phone: user.phone,
				gstin: user.gstin,
				address: user.address,
			});
		}
	}, [user])

	return (
		<div className="border bg-[var(--accent)] shadow-md shadow-foreground/40 p-4 rounded-xl grid gap-4">
			<h1 className="text-xl font-semibold pb-6">Customer Profile</h1>
			<div className="w-full flex md:flex-row flex-col gap-4 items-center justify-between">
				<div className="w-full flex flex-col gap-2">
					<Label title={'Company Name'} className='font-semibold' />
					<Input type='text' value={userInfo.companyName} onChange={(e) => setUserInfo({ ...userInfo, companyName: e.target.value })} className='h-12' />
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label title={'Contact Person'} />
					<Input type='text' value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} className='h-12' />
				</div>
			</div>

			<div className="w-full flex md:flex-row flex-col gap-4 items-center justify-between">
				<div className="w-full flex flex-col gap-2">
					<Label title={'Email'} />
					<Input type='text' value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} className='h-12' />
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label title={'Phone'} />
					<Input type='text' value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} className='h-12' />
				</div>
			</div>

			<div className="w-full flex md:flex-row flex-col gap-4 items-center justify-between">
				<div className="w-full flex flex-col gap-2">
					<Label title={'GSTIN (optional)'} />
					<Input type='text' value={userInfo.gstin} onChange={(e) => setUserInfo({ ...userInfo, gstin: e.target.value })} className='h-12' />
				</div>
				<div className="w-full flex flex-col gap-2">
					<Label title={'Address'} />
					<Input type='text' value={userInfo.address} onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} className='h-12' />
				</div>
			</div>
			<div className="w-full">
				<Button title={'Save Changes'} className="rounded-lg w-full" />
			</div>
		</div>
	)
}

