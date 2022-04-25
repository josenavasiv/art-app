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
		<div className="relative follower-grid-item ">
			<div className=" min-w-[350px] min-h-[200px] overflow-hidden parent bg-[#1d1020] -z-20 p-4 space-y-2 ">
				<div className="h-full w-full flex flex-row justify-start items-center space-x-4 p-1 ">
					<img
						className=" w-28 h-28 rounded-full cursor-pointer"
						src={user?.avatar}
						alt=""
						onClick={() => router.push(`/profile/${userId}`)}
					/>
					<div onClick={() => router.push(`/profile/${userId}`)} className="text-center z-20 cursor-pointer">
						<div className="text-2xl font-semibold text-[#F2E9E4]">{user?.displayName}</div>
						<div className="text-xs text-[#9A8C98]">{user?.headline}</div>
					</div>
					<FollowButton userId={userId} />
				</div>
				<div className="follower-artwork-grid">
					{followArtworks?.map(
						(followArtwork: { id: React.Key | null | undefined; imageUrl: string | undefined }) => (
							<div
								key={followArtwork.id}
								onClick={() => router.push(`/artwork/${followArtwork.id}`)}
								className="max-w-full max-h-full min-w-[100px] min-h-[125px] thumbnail cursor-pointer "
								style={{ backgroundImage: 'url(' + followArtwork?.imageUrl + ')' }}
							></div>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default FollowerProfile;
