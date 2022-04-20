import React from 'react';
import { useRouter } from 'next/router';

interface IMiniThumbnailProps {
	artworkId: string;
	thumbnailUrl: string;
}

const MiniThumbnail: React.FC<IMiniThumbnailProps> = ({ artworkId, thumbnailUrl }) => {
	const router = useRouter();
	return (
		<div
			className="max-w-full max-h-full min-w-[125px] min-h-[125px] overflow-hidden thumbnail cursor-pointer "
			onClick={() => router.push(`/artwork/${artworkId}`)}
			style={{ backgroundImage: 'url(' + thumbnailUrl + ')' }}
		></div>
	);
};

export default MiniThumbnail;
