import { Section } from '@prisma/client';
import React from 'react';
import Thumbnail from './Thumbnail';

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
	return (
		<div className="w-full upload-grid">
			{artworks.map((artwork) => (
				<Thumbnail
					key={artwork.id}
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
