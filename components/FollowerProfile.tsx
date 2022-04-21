import React from 'react';
import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';
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
		<div className="relative">
			<div className="max-w-full max-h-full min-w-[250px] min-h-[200px] overflow-hidden thumbnail cursor-pointer parent bg-gray-900 -z-20 p-4">
				<img className="w-full max-h-[125px] object-cover" src={user?.backgroundImageUrl} alt="" />
				<div className="min-h-[150px] w-full flex flex-col justify-center items-center space-y-2 relative -mb-3">
					<img className=" w-28 h-28 rounded-full absolute bottom-1/2 mb-2" src={user?.avatar} alt="" />
					<div className="text-center z-20">
						<div className="text-2xl">{user?.displayName}</div>
						<div className="text-xs text-gray-400">{user?.headline}</div>
					</div>
					<button className="text-xs bg-[#E63E6D] p-1.5 rounded-md">Follow</button>
				</div>
				<div className="tags-grid">
					{followArtworks?.map(
						(followArtwork: { id: React.Key | null | undefined; imageUrl: string | undefined }) => (
							<div
								key={followArtwork.id}
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
