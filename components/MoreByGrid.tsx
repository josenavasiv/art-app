import useSWR from 'swr';
import useUserArtworks from '../hooks/useUserArtworks';
import MiniThumbnail from './MiniThumbnail';

interface IMoreByGrid {
	userId: string;
}

const MoreByGrid: React.FC<IMoreByGrid> = ({ userId }) => {
	const { userArtworks, isLoading, isError, mutate, key } = useUserArtworks(userId);
	return (
		<div className="w-full more-by-grid">
			{/* @ts-ignore */}
			{userArtworks?.map((userArtwork) => (
				<MiniThumbnail
					key={userArtwork.id}
					artworkId={userArtwork.id}
					thumbnailUrl={userArtwork.thumbnailUrl}
				/>
			))}
		</div>
	);
};

export default MoreByGrid;
