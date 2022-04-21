import React from 'react';
import { useRouter } from 'next/router';

const Tag: React.FC<any> = ({ tag }) => {
	return (
		<div className="p-1 rounded-sm bg-[#E63E6D] text-xs text-white font-bold cursor-pointer truncate">#{tag}</div>
	);
};

export default Tag;
