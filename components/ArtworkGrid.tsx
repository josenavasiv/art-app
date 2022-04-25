import { Section } from '@prisma/client';
import React from 'react';
import Thumbnail from './Thumbnail';
import useLoggedInUser from '../hooks/useLoggedInUser';
import useUser from '../hooks/useUser';

export interface IArtwork {
	id: string;
	title: string;
	description: string;
	createAt: string;
	imageUrl: string;
	thumbnailUrl: string;
	tags: string[];
	viewCount: number;
	likeCount: number;
	mature: boolean;
	section: Section;
	subjects: string[];
	authorId: string;
}

export interface IArtworkGridProps {
	artworks: IArtwork[];
}

const UploadGrid: React.FC<IArtworkGridProps> = ({ artworks }) => {
	const { loggedInUser } = useLoggedInUser();
	// console.log(loggedInUser);

	const filterByMatureContent = (artwork: any) => {
		if (loggedInUser?.showMatureContent) {
			return true;
		} else {
			if (artwork.mature) return false;
			else return true;
		}
	};

	const filteredArtworks = artworks.filter(filterByMatureContent);
	// console.log(filteredArtworks);

	return (
		<div className="w-full upload-grid">
			{filteredArtworks.map((artwork, index) => (
				<Thumbnail
					key={`${artwork.id} + ${index}`}
					authorId={artwork.authorId}
					artworkId={artwork.id}
					artworkTitle={artwork.title}
					thumbnailUrl={artwork.thumbnailUrl}
				/>
			))}
		</div>
	);
};

export default UploadGrid;

// Need to filter out mature content in the frontend instead of the backend
// due to being unable to use getSession in /api/artworks
