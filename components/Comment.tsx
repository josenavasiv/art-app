import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { getRelativeDate } from '../lib/relativeTime';

interface IComment {
	commentId: string;
	content: string;
	authorId: string;
	createdAt: string;
}

const Comment: React.FC<IComment> = ({ commentId, content, authorId, createdAt }) => {
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
			<div className="flex justify-center items-center">
				<div className="font-medium flex flex-row justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						width="192"
						height="192"
						viewBox="0 0 24 24"
						style={{ fill: '#F2E9E4' }}
						className="animate-pulse "
					>
						{' '}
						<path d="M 4 3 C 2.9 3 2 3.9 2 5 L 2 15.792969 C 2 16.237969 2.5385156 16.461484 2.8535156 16.146484 L 5 14 L 14 14 C 15.1 14 16 13.1 16 12 L 16 5 C 16 3.9 15.1 3 14 3 L 4 3 z M 18 8 L 18 12 C 18 14.209 16.209 16 14 16 L 8 16 L 8 17 C 8 18.1 8.9 19 10 19 L 19 19 L 21.146484 21.146484 C 21.461484 21.461484 22 21.237969 22 20.792969 L 22 10 C 22 8.9 21.1 8 20 8 L 18 8 z"></path>
					</svg>
				</div>
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
		<div className="flex flex-row space-x-3 text-sm relative">
			<img
				className="h-7 w-7 rounded-full cursor-pointer mt-1"
				src={user.avatar ?? user.image}
				alt=""
				onClick={() => router.push(`/profile/${user.id}`)}
			/>
			<div className="flex flex-col space-y-2 w-full">
				<div className="relative">
					<Link href={`/profile/${user.id}`}>
						<a className="text-xs font-medium text-[#e80059]">{user.displayName ?? user.name}</a>
					</Link>
					<div className="text-[9px] text-[#9A8C98] font-medium">{user.headline}</div>
				</div>

				{editing ? (
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-60">
						<textarea
							{...register('content', { required: true })}
							className=" border border-[#b7094c] rounded-sm text-sm w-full p-1 bg-secondary text-[#F2E9E4]"
						/>
						<button
							type="submit"
							className=" h-4 w-10 rounded-sm hover:text-white text-xs text-[#b7094c] self-end flex justify-center items-center pr-1"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-[15px] w-[13px]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
							</svg>
						</button>
					</form>
				) : (
					<div className="flex flex-col">
						<div className="break-words whitespace-pre-line">{currentComment}</div>
						<div className=" text-[#9A8C98] italic self-end text-[9px]">{getRelativeDate(createdAt)}</div>
					</div>
				)}
			</div>
			{canEditDelete && (
				<div className="flex flex-row space-x-2 text-xs absolute right-0 pt-1 text-[#b7094c]">
					<div className="cursor-pointer" onClick={() => setEditing(!editing)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-[17px] w-[15px] hover:text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
							<path
								fillRule="evenodd"
								d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div onClick={onDelete} className="cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-[17px] w-[15px] hover:text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			)}
		</div>
	);
};

export default Comment;

// Max-Width Styling property is done in the /artwork/[id] page
