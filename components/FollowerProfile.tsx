import React from 'react';
import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';

import FollowButton from './FollowButton';
import useFollowArtworks from '../hooks/useFollowArtworks';

interface IFollowerProfile {
	userId: string;
}

const FollowerProfile: React.FC<IFollowerProfile> = ({ userId }) => {
	const router = useRouter();
	const { user, isLoading: userIsLoading, isError: userIsError } = useUser(userId);
	const {
		followArtworks,
		isLoading: userArtworksIsLoading,
		isError: userArtworksIsError,
	} = useFollowArtworks(userId);

	return (
		<div className="min-w-[350px] min-h-[350px] follower-profile-bg p-4 flex flex-col">
			<div className="h-full w-full flex flex-col justify-start items-center space-y-2">
				<img
					className="w-28 h-28 rounded-full cursor-pointer"
					src={user?.avatar ?? user?.image}
					alt=""
					onClick={() => router.push(`/profile/${userId}`)}
				/>
				<div onClick={() => router.push(`/profile/${userId}`)} className="text-center z-20 cursor-pointer ">
					<div className="text-2xl font-semibold bg-accent-primary">{user?.displayName ?? user?.name}</div>
					<div className="text-xs font-medium text-secondary">{user?.headline}</div>
				</div>
				<FollowButton userId={userId} />
			</div>
			<div className="follower-artwork-grid pt-2">
				{followArtworks?.map(
					(followArtwork: { id: React.Key | null | undefined; imageUrl: string | undefined }) => (
						<div
							key={followArtwork.id}
							onClick={() => router.push(`/artwork/${followArtwork.id}`)}
							className="max-w-full max-h-full min-w-[100px] min-h-[100px] thumbnail cursor-pointer"
							// @ts-ignore
							style={{ backgroundImage: 'url(' + followArtwork?.thumbnailUrl + ')' }}
						></div>
					)
				)}
			</div>
		</div>
	);
};

export default FollowerProfile;
