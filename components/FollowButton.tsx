import React from 'react';
import useIsFollowing from '../hooks/useIsFollowing';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { useRouter } from 'next/router';

interface IFollowButton {
	userId: string;
}

const FollowButton: React.FC<IFollowButton> = ({ userId }) => {
	const router = useRouter();
	const { loggedInUser, isLoading: isLoggedInUserLoading, isError: isLoggedInUserError } = useLoggedInUser();
	const { following, isLoading, isError, mutate, mutate_key } = useIsFollowing(userId);

	const handleFollow = async () => {
		const result = await fetch(`/api/user/${userId}/follow`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		mutate(mutate_key);
		// router.reload();
	};

	const handleUnfollow = async () => {
		const result = await fetch(`/api/user/${userId}/follow`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		mutate(mutate_key);
		router.reload();
	};

	// If logged in user sees own profile, do not display the follow button
	if (!loggedInUser || userId === loggedInUser?.id) {
		return <div></div>;
	}

	return (
		<>
			{following ? (
				<div
					onClick={handleUnfollow}
					className="bg-[#b7094c] text-[#F2E9E4] w-24 rounded-sm cursor-pointer py-1 px-8 flex flex-row text-xs justify-center items-center space-x-1"
				>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-[17px] w-[15px] hover:text-white pb-0.5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
						</svg>
					</div>

					<div className="font-bold">FOLLOWED</div>
				</div>
			) : (
				<div
					onClick={handleFollow}
					className="bg-[#b7094c] text-[#F2E9E4] w-20 rounded-sm cursor-pointer py-1 px-8 flex flex-row text-xs justify-center items-center space-x-1"
				>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-[17px] w-[15px] hover:text-white pb-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							/>
						</svg>
					</div>

					<div className="font-bold">FOLLOW</div>
				</div>
			)}
		</>
	);
};

export default FollowButton;
