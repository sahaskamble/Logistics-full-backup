'use client'
import { useState } from "react";
import { Lock, Eye, EyeOff } from 'lucide-react';
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useAuth } from "@/contexts/AuthContext";
import pbclient from '@/lib/db';
import { toast } from 'sonner';

export default function Password() {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false
	});

	const [passwordInfo, setPasswordInfo] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const togglePasswordVisibility = (field) => {
		setShowPasswords(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	const validatePassword = (password) => {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (password.length < minLength) {
			return 'Password must be at least 8 characters long';
		}
		if (!hasUpperCase) {
			return 'Password must contain at least one uppercase letter';
		}
		if (!hasLowerCase) {
			return 'Password must contain at least one lowercase letter';
		}
		if (!hasNumbers) {
			return 'Password must contain at least one number';
		}
		if (!hasSpecialChar) {
			return 'Password must contain at least one special character';
		}
		return null;
	};

	const handleChangePassword = async () => {
		// Validation
		if (!passwordInfo.currentPassword) {
			toast.error('Please enter your current password');
			return;
		}

		if (!passwordInfo.newPassword) {
			toast.error('Please enter a new password');
			return;
		}

		if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		const passwordError = validatePassword(passwordInfo.newPassword);
		if (passwordError) {
			toast.error(passwordError);
			return;
		}

		setIsLoading(true);
		try {
			// First verify current password by attempting to authenticate
			await pbclient.collection('users').authWithPassword(user.email, passwordInfo.currentPassword);

			// If authentication successful, update password
			await pbclient.collection('users').update(user.id, {
				password: passwordInfo.newPassword,
				passwordConfirm: passwordInfo.confirmPassword
			});

			// Clear form
			setPasswordInfo({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});

			toast.success('Password changed successfully');
		} catch (error) {
			console.error('Error changing password:', error);
			if (error.status === 400) {
				toast.error('Current password is incorrect');
			} else {
				toast.error('Failed to change password');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-lg p-6">
			{/* Header */}
			<div className="flex items-center gap-2 mb-6">
				<Lock className="w-5 h-5 text-green-600" />
				<h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
			</div>

			{/* Password Form */}
			<div className="space-y-6">
				{/* Current Password */}
				<div className="space-y-2">
					<Label title="Current Password" />
					<div className="relative">
						<Input
							type={showPasswords.current ? 'text' : 'password'}
							value={passwordInfo.currentPassword}
							onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
							className="h-12 pr-10"
							placeholder="Enter your current password"
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('current')}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							{showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
						</button>
					</div>
				</div>

				{/* New Password */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label title="New Password" />
						<div className="relative">
							<Input
								type={showPasswords.new ? 'text' : 'password'}
								value={passwordInfo.newPassword}
								onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
								className="h-12 pr-10"
								placeholder="Enter new password"
							/>
							<button
								type="button"
								onClick={() => togglePasswordVisibility('new')}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
					</div>

					<div className="space-y-2">
						<Label title="Confirm Password" />
						<div className="relative">
							<Input
								type={showPasswords.confirm ? 'text' : 'password'}
								value={passwordInfo.confirmPassword}
								onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
								className="h-12 pr-10"
								placeholder="Confirm new password"
							/>
							<button
								type="button"
								onClick={() => togglePasswordVisibility('confirm')}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
					</div>
				</div>

				{/* Password Requirements */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
					<ul className="text-xs text-blue-700 space-y-1">
						<li>• At least 8 characters long</li>
						<li>• Contains uppercase and lowercase letters</li>
						<li>• Contains at least one number</li>
						<li>• Contains at least one special character</li>
					</ul>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<Button
						title={isLoading ? 'Changing Password...' : 'Change Password'}
						onClick={handleChangePassword}
						className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
						disabled={isLoading}
					/>
				</div>
			</div>
		</div>
	)
}

