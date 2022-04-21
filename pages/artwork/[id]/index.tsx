import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import prisma from '../../../lib/prisma';
import Navbar from '../../../components/Navbar';
import Comment from '../../../components/Comment';
import MoreByGrid from '../../../components/MoreByGrid';
import TagsGrid from '../../../components/TagsGrid';

import useComments from '../../../hooks/useComments';
import useUser from '../../../hooks/useUser';

import { getRelativeDate } from '../../../lib/relativeTime';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.query.id as string; // Get over TypeScript string issue

	const updateViews = await prisma.artwork.update({
		where: {
			id: id,
		},
		data: {
			viewCount: {
				increment: 1,
			},
		},
	});

	const data = await prisma.artwork.findUnique({
		where: { id: id },
	});
	const artworkDetails = JSON.parse(JSON.stringify(data));
	// console.log(artworkDetails);

	const session = await getSession(context);

	let userCanLike = true;
	const userResult = await prisma.user.findUnique({
		// @ts-ignore
		where: { email: session?.user?.email || 'User is not logged in' },
	});

	const likeResult = await prisma.like.findUnique({
		where: {
			// @ts-ignore
			artworkId_authorId: {
				// @ts-ignore
				authorId: userResult?.id || 'User is not logged in',
				// @ts-ignore
				artworkId: id,
			},
		},
	});
	if (likeResult) {
		userCanLike = false;
	}
	return {
		props: {
			artworkDetails,
			session,
			userCanLike,
		},
	};
};

// Add async function that pings /api/artwork/[:id]/comments to retrieve the upload's comments (and add spinner loader)
// Add like async function that pins /api/artwork/[:id]/like (need to check if user has already liked)

interface IFormInput {
	content: string;
}

const index: React.FC = ({
	artworkDetails,
	session,
	userCanLike,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [canLike, setCanLike] = useState(userCanLike);

	const { user, isLoading: userIsLoading, isError: userIsError } = useUser(artworkDetails.authorId);
	const {
		comments,
		isLoading: commentIsLoading,
		isError: commentIsError,
		mutate,
		mutate_key,
	} = useComments(artworkDetails.id);

	// use the useUser Hook (SWR to fetch user) and session to check if the logged-in user is allowed to edit or delete artwork
	let canEditDelete = false;
	// @ts-ignore
	if (user?.email === session?.user?.email) {
		canEditDelete = true;
	}

	const { register, handleSubmit, formState, reset } = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		// The Data is an object of the registered input elements
		// Will pass data to a function that calls the internal API that prisma creates and also uploads image to cloudinary
		const content = data.content;
		const body = { content };
		// Calls internal API to create a new comment with the prisma client
		const result = await fetch(`/api/artwork/${artworkDetails.id}/comment`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		// Refreshes the comments
		mutate(mutate_key);
		reset(); // Clears the comment input values
		return;
	};

	// DELETE FUNCTION
	const onDelete = async () => {
		const result = await fetch(`/api/artwork/${artworkDetails.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		return router.push('/');
	};

	const handleLike = async () => {
		const result = await fetch(`/api/artwork/${artworkDetails.id}/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		setCanLike(false);
	};

	const handleUnlike = async () => {
		const result = await fetch(`/api/artwork/${artworkDetails.id}/like`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		setCanLike(true);
	};

	return (
		<>
			<div className="h-screen relative">
				<div className="absolute top-0 w-full z-10">
					<Navbar />
				</div>
				<div className="flex flex-row justify-center align-middle mr-[320px] h-full">
					<div className="h-full w-full flex justify-center">
						<img src={artworkDetails.imageUrl} alt="" className="self-center" />
					</div>

					<div className="fixed bg-gray-900 text-white h-full w-[320px] overflow-y-auto right-0 p-5 pt-[76px] space-y-6">
						<div className="flex flex-row space-x-3 relative">
							{userIsLoading && <div>LOADING USER DETAILS</div>}
							{user && (
								<>
									<img
										onClick={() => router.push(`/profile/${user.id}`)}
										className="rounded-full w-12 h-12 cursor-pointer "
										src={user.avatar ?? user.image}
										alt=""
									/>
									<div className="flex flex-col">
										<div
											onClick={() => router.push(`/profile/${user.id}`)}
											className="text-md cursor-pointer font-medium text-[#DB6B97]"
										>
											{user.displayName ?? user.name}
										</div>
										<div className="text-xs text-gray-400 font-normal">{user.headline}</div>
									</div>
									{canEditDelete && (
										<div className="flex flex-row space-x-2 text-xs absolute right-0 text-gray-400 py-1">
											<div
												className="cursor-pointer"
												onClick={() => router.push(`/artwork/${artworkDetails.id}/edit`)}
											>
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
											<div onClick={() => setShowModal(true)} className="cursor-pointer">
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

											{showModal ? (
												<>
													<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
														<div className="relative w-auto my-6 mx-auto max-w-3xl">
															{/*content*/}
															<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 text-lg text-gray-300 outline-none focus:outline-none justify-center items-center pt-7">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="h-24 w-24 text-[#E63E6D]"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	strokeWidth={3}
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
																{/*body*/}
																<div className="relative p-8 flex-auto">
																	<p className="my-4 text-white text-xl py-3 leading-relaxed">
																		Are you sure you want to delete this artwork?
																	</p>
																</div>
																{/*footer*/}
																<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b space-x-4">
																	<button
																		className="bg-emerald-600 text-white active:bg-[#FFDADA] font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
																		type="button"
																		onClick={() => setShowModal(false)}
																	>
																		GO BACK
																	</button>
																	<button
																		className="bg-[#E63E6D] text-white active:bg-[#DB6B97] font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
																		type="button"
																		onClick={onDelete}
																	>
																		DELETE
																	</button>
																</div>
															</div>
														</div>
													</div>
													<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
												</>
											) : null}
										</div>
									)}
								</>
							)}
						</div>
						{session && (
							<div className="flex flex-row items-center">
								{canLike ? (
									<div
										onClick={handleLike}
										className="bg-blue-300 w-1/5 rounded-sm cursor-pointer py-1 px-3 flex flex-row text-xs justify-center items-center space-x-1"
									>
										<div>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-[17px] w-[15px] hover:text-white pb-0.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
												/>
											</svg>
										</div>

										<div className="font-bold">LIKE</div>
									</div>
								) : (
									<div
										onClick={handleUnlike}
										className="bg-blue-300 w-1/5 rounded-sm cursor-pointer py-1 px-8 flex flex-row text-xs justify-center items-center space-x-1"
									>
										<div>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-[17px] w-[15px] hover:text-white pb-0.5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
											</svg>
										</div>

										<div className="font-bold">LIKED</div>
									</div>
								)}
							</div>
						)}

						<div className="flex flex-col space-y-2">
							<div className="text-3xl font-semibold">{artworkDetails.title}</div>
							<div className="text-sm pb-2 whitespace-pre-line">{artworkDetails.description}</div>
							<div className="text-xs text-gray-400 italic">
								Posted {getRelativeDate(artworkDetails.createdAt)}
							</div>
							<div className="flex flex-row justify-between">
								<div className="flex flex-row space-x-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-[15px] w-[13px]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
										<path
											fillRule="evenodd"
											d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
											clipRule="evenodd"
										/>
									</svg>

									<div className="text-xs">{artworkDetails.viewCount} views</div>
								</div>
								<div className="flex flex-row space-x-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-[15px] w-[13px]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
									</svg>
									<div className="text-xs">{artworkDetails.likeCount} likes</div>
								</div>
								<div className="flex flex-row space-x-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-[15px] w-[13px]"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
										<path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
									</svg>
									<div className="text-xs">{comments?.length} comments</div>
								</div>
							</div>
						</div>

						<MoreByGrid userId={artworkDetails.authorId} />

						<TagsGrid tags={artworkDetails.tags} />

						{/* Comments Section */}
						<div className="flex flex-col w-full space-y-7">
							{commentIsLoading && <div>LOADING COMMENTS ADD SPINNER HERE</div>}
							{comments && (
								<>
									{comments.map((comment: string) => (
										<Comment
											// @ts-ignore
											key={comment.id} // @ts-ignore
											commentId={comment.id} // @ts-ignore
											content={comment?.content} // @ts-ignore
											authorId={comment?.authorId}
											// @ts-ignore
											createdAt={comment?.createdAt}
										/>
									))}
								</>
							)}
						</div>

						{/* Post a Comment Section */}
						{session && (
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-4 flex flex-col text-gray-300 w-full bg-gray-900"
							>
								<textarea
									id="comment"
									placeholder="Share a comment or provide feedback!"
									{...register('content', { required: true, maxLength: 130 })}
									className=" text-gray-900 border border-gray-500 rounded-sm text-sm w-full p-2.5 bg-gray-900 dark:text-white "
								/>

								<input
									disabled={formState.isSubmitting}
									className="p-2 rounded-md bg-[#E63E6D] w-32 text-xs font-semibold"
									type="submit"
									value="Add Comment"
								/>
							</form>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default index;

// artworkDetails
// {
// 	id: 'cl20zufjm0136rgtsm1ut0v8u',
// 	title: 'FLY',
// 	description: 'NUTS',
// 	createdAt: '2022-04-15T22:20:17.074Z',
// 	imageUrl: 'https://cdna.artstation.com/p/assets/images/images/017/674/056/large/artyom-turskyi-777-8.jpg?1556901383',
// 	thumbnailUrl: 'https://cdna.artstation.com/p/assets/images/images/017/674/056/large/artyom-turskyi-777-8.jpg?1556901383',
// 	tags: [],
// 	viewCount: 0,
// 	mature: false,
// 	section: 'COMMUNITY',
// 	subjects: [],
// 	uploadedBy: 'JOPS',
// 	uploadedByImageUrl: null,
// 	authorId: 'cl20ziwqy0010gctsg7q9vn6h'
//   }

// use SWR|React Query to grab the comments
