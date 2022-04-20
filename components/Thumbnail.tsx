import React from 'react';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';

interface IThumbnailProps {
	authorId: string;
	artworkId: string;
	artworkTitle: string;
	thumbnailUrl: string;
}

const Thumbnail: React.FC<IThumbnailProps> = ({ authorId, artworkId, artworkTitle, thumbnailUrl }) => {
	const router = useRouter();
	const { user, isLoading, isError } = useUser(authorId);

	return (
		// <div
		// 	className="max-w-full max-h-full min-w-[250px] min-h-[200px] overflow-hidden relative parent cursor-pointer"
		// 	onClick={() => router.push(`/artwork/${artworkId}`)}
		// >
		// 	<img
		// 		className="w-full absolute self-center justify-center parent-hover:move object-cover"
		// 		src={thumbnailUrl}
		// 		alt=""
		// 	/>
		// </div>

		// =========GOOD=========
		// <div
		// 	className="max-w-full max-h-full min-w-[250px] min-h-[200px] overflow-hidden thumbnail cursor-pointer parent"
		// 	onClick={() => router.push(`/artwork/${artworkId}`)}
		// 	style={{ backgroundImage: 'url(' + thumbnailUrl + ')' }}
		// >
		// 	<div className='content'></div>
		// </div>
		<div className="relative">
			<div
				className="max-w-full max-h-full min-w-[250px] min-h-[200px] overflow-hidden thumbnail cursor-pointer parent"
				onClick={() => router.push(`/artwork/${artworkId}`)}
				style={{ backgroundImage: 'url(' + thumbnailUrl + ')' }}
			>
				{user && (
					<div className="w-full h-full opacity-0 hover:opacity-100 duration-300 absolute z-10 flex flex-row text-[#E63E6D] thumbnail-text">
						<div className="flex flex-row self-end p-3 space-x-2">
							<img className="rounded-full w-8 h-8 self-center" src={user.avatar ?? user.image} alt="" />
							<div className="flex flex-col self-center">
								<p className="text-sm font-semibold">{artworkTitle}</p>
								<p className="text-xs font-light">{user.displayName ?? user.name}</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Thumbnail;
