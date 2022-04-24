import React from 'react';
import { useRouter } from 'next/router';

const Tag: React.FC<any> = ({ tag }) => {
	return (
		<div className="p-1 rounded-sm bg-[#b7094c] text-xs text-[#F2E9E4] font-bold cursor-pointer truncate">
			#{tag}
		</div>
	);
};

export default Tag;
