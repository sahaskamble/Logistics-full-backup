'use client'
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import ProfileHeader from "./components/ProfileHeader";
import ProfileOverview from "./components/ProfileOverview";
import DocumentsSection from "./components/DocumentsSection";
import Password from "./components/Password";

export default function ProfilePage() {
	const { setTitle } = useSidebar();
	const { user } = useAuth();
	const [currentUser, setCurrentUser] = useState(user);

	// Fetch user profile data
	const { data: userProfile, loading: profileLoading, mutation: refreshProfile } = useCollection('user_profile', {
		filter: `user.id = "${user?.id}"`,
		expand: 'user'
	});

	useEffect(() => {
		setTitle('Customer Profile Update')
	}, [setTitle]);

	const handleUserUpdate = (updatedUser) => {
		setCurrentUser(updatedUser);
		refreshProfile();
	};

	const currentProfile = userProfile?.[0] || null;

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Profile Header with Avatar */}
				<ProfileHeader
					user={currentUser}
					onUserUpdate={handleUserUpdate}
					userProfile={currentProfile}
				/>

				{/* Profile Overview Section */}
				<ProfileOverview
					user={currentUser}
					userProfile={currentProfile}
					onUserUpdate={handleUserUpdate}
					refreshProfile={refreshProfile}
					loading={profileLoading}
				/>

				{/* Documents Section */}
				<DocumentsSection
					user={currentUser}
					userProfile={currentProfile}
					refreshProfile={refreshProfile}
				/>

				{/* Password Change Section */}
				<Password />
			</div>
		</div>
	)
}

