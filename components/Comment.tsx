import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

interface IComment {
	commentId: string;
	content: string;
	authorId: string;
}

const Comment: React.FC<IComment> = ({ commentId, content, authorId }) => {
	const router = useRouter();
	const { user, isLoading, isError } = useUser(authorId);
	const { data: session, status } = useSession();

	const { register, handleSubmit, formState, setValue } = useForm<IComment>();

	const [editing, setEditing] = useState(false);
	const [currentComment, setSurrentComment] = useState(content);

	let canEditDelete = false;

	// @ts-ignore
	if (user?.email === session?.user?.email) {
		canEditDelete = true;
	}

	setValue('content', currentComment);
	const onSubmit: SubmitHandler<IComment> = async (data) => {
		const newContent = data.content;
		const body = { newContent, authorId };

		const result = await fetch(`/api/comment/${commentId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const comment_data = await result.json();
		console.log(comment_data);
		setSurrentComment(comment_data.content);
		setEditing(!editing);
		return;
	};

	const onDelete = async () => {
		const body = { authorId };
		const result = await fetch(`/api/comment/${commentId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		return window.location.reload();
	};

	if (isLoading) {
		return (
			<div className="flex flex-col">
				<div>{authorId}</div>
				<div>{content}</div>
			</div>
		);
	}

	if (isError) {
		<div className="flex flex-col">
			<div>An Error has occurred getting user data</div>
			<div>{content}</div>
		</div>;
	}

	return (
		<div className="flex flex-row space-x-2 text-sm relative">
			<img
				className="h-6 w-6 rounded-full cursor-pointer"
				src={user.avatar ?? user.image}
				alt=""
				onClick={() => router.push(`/profile/${user.id}`)}
			/>
			<div className="flex flex-col space-y-2 ">
				<div className="relative">
					<Link href={`/profile/${user.id}`}>
						<a className="text-xs font-medium text-[#DB6B97]">{user.displayName ?? user.name}</a>
					</Link>
					<div className="text-[9px] font-light text-gray-400 ">{user.headline}</div>
				</div>

				{editing ? (
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-60">
						<textarea
							{...register('content', { required: true })}
							className=" text-gray-900 border border-gray-500 rounded-sm text-sm w-full p-1 bg-gray-900 dark:text-white"
						/>
						<button
							type="submit"
							className="bg-[#FFDADA] h-4 w-10 rounded-sm hover:bg-[#fffafa] text-xs text-[#080808] self-end"
						>
							SAVE
						</button>
					</form>
				) : (
					<div className="break-words">{currentComment}</div>
				)}
			</div>
			{canEditDelete && (
				<div className="flex flex-row space-x-2 text-xs absolute right-0 pt-1 text-[#080808]">
					<button
						onClick={() => setEditing(!editing)}
						className="bg-[#FFDADA] h-4 w-8 rounded-sm hover:bg-[#fffafa]"
					>
						EDIT
					</button>
					{/* There should be a pop up that warns if you want to delete, then just straight send to the /api/artwork/[id] */}
					<button onClick={onDelete} className="bg-[#E63E6D] h-4 w-11 rounded-sm hover:bg-[#DB6B97]">
						DELETE
					</button>
				</div>
			)}
		</div>
	);
};

export default Comment;

// Max-Width Styling property is done in the /artwork/[id] page
