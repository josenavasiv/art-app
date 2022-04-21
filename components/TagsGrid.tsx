import React from 'react';
import Tag from './Tag';

const TagsGrid: React.FC<any> = ({ tags }) => {
	return (
		<div className="w-full tags-grid">
			{tags.map((tag: string, index: number) => (
				<Tag key={index} tag={tag} />
			))}
		</div>
	);
};

export default TagsGrid;
