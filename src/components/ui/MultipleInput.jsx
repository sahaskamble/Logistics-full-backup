import { Minus, Plus } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

export default function MultipleInput({ inputFields, handleAddField, handleRemoveField, handleInputChange, placeholder }) {

	return (
		<div className="grid gap-4">
			{inputFields.map((field) => (
				<div key={field.id} className="flex items-center space-x-2">
					<Input
						type="text"
						value={field.value}
						onChange={(e) => handleInputChange(field.id, e.target.value)}
						placeholder={placeholder}
						className="flex-1"
					/>
					<button
						type="button"
						onClick={() => handleRemoveField(field.id)}
						className="cursor-pointer"
						disabled={inputFields.length === 1}
					>
						<Minus
							className="text-primary"
						/>
					</button>
				</div>
			))}

			<div className="flex">
				<Button
					title={'Add'}
					onClick={handleAddField}
					icon={<Plus className="w-4 h-4 text-background" />}
					iconPosition="right"
					className="rounded-md"
					textSize="text-xs"
				/>
			</div>

		</div>
	)
}

