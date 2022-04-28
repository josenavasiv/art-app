import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { Dialog, Transition } from '@headlessui/react';
import Head from 'next/head';
import Linkify from 'react-linkify';

import Navbar from '../../../components/Navbar';
import Comment from '../../../components/Comment';
import MoreByGrid from '../../../components/MoreByGrid';
import TagsGrid from '../../../components/TagsGrid';
import FollowButton from '../../../components/FollowButton';

import useComments from '../../../hooks/useComments';
import useUser from '../../../hooks/useUser';
import useArtwork from '../../../hooks/useArtwork';
import useLike from '../../../hooks/useLike';

import { getRelativeDate } from '../../../lib/relativeTime';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '../../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.query.id;
	const data = await prisma.artwork.update({
		where: {
			// @ts-ignore
			id: id,
		},
		data: {
			viewCount: {
				increment: 1,
			},
		},
	});

	const artworkDetails = JSON.parse(JSON.stringify(data));

	return {
		props: {
			artworkDetails,
		},
	};
};

// Add async function that pings /api/artwork/[:id]/comments to retrieve the upload's comments (and add spinner loader)
// Add like async function that pins /api/artwork/[:id]/like (need to check if user has already liked)

interface IFormInput {
	content: string;
}

const index: React.FC = ({ artworkDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const artworkId: string | string[] = router.query.id;
	const { data: session } = useSession();
	// const { loggedInUser, isLoading } = useLoggedInUser();
	// const { artworkDetails, artworkIsLoading, artworkIsError } = useArtwork(artworkId as string);
	const { liked, likeIsLoading, mutateLike, likeKey } = useLike(artworkId as string);

	// const [showModal, setShowModal] = useState(false);
	let [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const { user, isLoading: userIsLoading, isError: userIsError } = useUser(artworkDetails?.authorId);

	const {
		comments,
		isLoading: commentIsLoading,
		isError: commentIsError,
		mutate,
		mutate_key,
	} = useComments(artworkDetails?.id);

	let canEditDelete = false;
	// use the useUser Hook (SWR to fetch user) and loggedInUser to check if the logged-in user is allowed to edit or delete artwork
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
		// const imageCloudinaryId = artworkDetails.imageUrl.split('/').pop().split('.').shift();
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
		mutateLike(likeKey);

		// router.reload();
	};

	const handleUnlike = async () => {
		const result = await fetch(`/api/artwork/${artworkDetails.id}/like`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		mutateLike(likeKey);

		router.reload();
	};

	return (
		<>
			<Head>
				<title>Artwork - {artworkDetails?.title}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className="h-screen relative">
				<div className="absolute top-0 w-full z-10">
					<Navbar />
				</div>
				<div className="flex flex-col md:flex-row justify-center align-middle md:mr-[365px] h-full">
					<div className="h-2/3 top-0 fixed md:static md:h-full w-full flex justify-center items-center sm:border-b sm:border-[#9A8C98]">
						{/* {artworkIsLoading && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								x="0px"
								y="0px"
								width="256"
								height="256"
								viewBox="0 0 520 520"
								style={{ fill: '#F2E9E4' }}
								className="animate-pulse "
							>
								<path d="M 365 30 C 345.701 30 330 45.701 330 65 C 330 84.299 345.701 100 365 100 C 384.299 100 400 84.299 400 65 C 400 45.701 384.299 30 365 30 z M 260 50 A 10 10 0 0 0 260 70 A 10 10 0 0 0 260 50 z M 365 50 C 373.271 50 380 56.729 380 65 C 380 73.271 373.271 80 365 80 C 356.729 80 350 73.271 350 65 C 350 56.729 356.729 50 365 50 z M 460 60 A 10 10 0 0 0 460 80 A 10 10 0 0 0 460 60 z M 131.01172 77.285156 C 110.57018 77.739112 91.872641 91.343984 85.931641 112.00586 L 83.71875 119.70508 C 65.29975 125.15308 51.816406 142.21495 51.816406 162.37695 L 51.816406 230.66797 L 33.908203 292.94922 C 28.324203 312.37222 35.796453 333.32958 51.814453 345.01758 L 51.814453 357.62109 C 51.814453 382.15809 71.777453 402.12109 96.314453 402.12109 L 239.97656 402.12109 L 374.69336 440.85352 C 400.16036 448.17852 426.73636 433.50114 434.06836 407.99414 L 436.28125 400.29492 C 454.70025 394.84692 468.18359 377.78309 468.18359 357.62109 L 468.18359 289.33008 L 486.08984 227.04883 C 491.67484 207.62583 484.20355 186.67142 468.18555 174.98242 L 468.18555 162.37695 C 468.18555 137.83895 448.22255 117.87695 423.68555 117.87695 L 280.02539 117.87695 L 145.30664 79.146484 C 140.53908 77.775672 135.729 77.180397 131.01172 77.285156 z M 60 80 A 10 10 0 0 0 60 100 A 10 10 0 0 0 60 80 z M 131.44336 97.279297 C 134.19474 97.218398 137.00025 97.567125 139.78125 98.367188 L 207.64258 117.87695 L 105.05273 117.87695 L 105.15234 117.5293 C 108.61603 105.47992 119.52072 97.543191 131.44336 97.279297 z M 423.68555 137.87891 C 437.19555 137.87891 448.18555 148.86991 448.18555 162.37891 L 448.18555 357.62305 C 448.18555 368.97805 440.41892 378.55241 429.91992 381.31641 C 427.97892 381.03341 426.05747 381.33047 424.35547 382.10547 C 423.38247 382.13047 99.530406 382.12305 96.316406 382.12305 C 82.807406 382.12305 71.816406 371.13305 71.816406 357.62305 L 71.816406 162.37695 C 71.816406 151.02695 79.575406 141.4565 90.066406 138.6875 C 92.000406 138.9725 93.889578 138.69053 95.642578 137.89453 C 96.581578 137.86853 320.95955 137.88191 423.68555 137.87891 z M 100 160 C 94.477 160 90 164.477 90 170 L 90 350 C 90 355.522 94.477 360 100 360 L 420 360 C 425.522 360 430 355.522 430 350 L 430 170 C 430 164.477 425.522 160 420 160 L 100 160 z M 110 180 L 410 180 L 410 200 L 360 200 C 354.478 200 350 204.477 350 210 C 350 215.523 354.478 220 360 220 L 410 220 L 410 340 L 394.72852 340 L 315.58594 243.65234 C 311.59994 238.79934 304.17983 238.79056 300.17383 243.60156 L 259.43164 292.5293 L 219.28125 243.65234 C 215.28825 238.79234 207.83217 238.77634 203.82617 243.65234 L 124.68555 340 L 110 340 L 110 270 L 130 270 C 135.523 270 140 265.522 140 260 C 140 254.477 135.523 250 130 250 L 110 250 L 110 180 z M 260 190 C 243.458 190 230 203.458 230 220 C 230 236.542 243.458 250 260 250 C 276.542 250 290 236.542 290 220 C 290 203.458 276.542 190 260 190 z M 330 200 A 10 10 0 0 0 330 220 A 10 10 0 0 0 330 200 z M 260 210 C 265.514 210 270 214.486 270 220 C 270 225.514 265.514 230 260 230 C 254.486 230 250 225.514 250 220 C 250 214.486 254.486 210 260 210 z M 160 250 A 10 10 0 0 0 160 270 A 10 10 0 0 0 160 250 z M 307.80664 265.69141 L 368.8457 340 L 298.42383 340 L 272.35547 308.26562 L 307.80664 265.69141 z M 211.55469 265.75586 C 218.51669 274.23086 265.52306 331.459 272.53906 340 L 150.56836 340 L 211.55469 265.75586 z M 312.35742 402.12305 L 414.94727 402.12305 L 414.84766 402.4707 C 410.58366 417.3007 395.05075 425.89477 380.21875 421.63477 L 312.35742 402.12305 z M 50 420 A 10 10 0 0 0 50 440 A 10 10 0 0 0 50 420 z M 150 420 C 133.458 420 120 433.458 120 450 C 120 466.542 133.458 480 150 480 C 166.542 480 180 466.542 180 450 C 180 433.458 166.542 420 150 420 z M 240 430 A 10 10 0 0 0 240 450 A 10 10 0 0 0 240 430 z M 150 440 C 155.514 440 160 444.486 160 450 C 160 455.514 155.514 460 150 460 C 144.486 460 140 455.514 140 450 C 140 444.486 144.486 440 150 440 z M 430 450 A 10 10 0 0 0 430 470 A 10 10 0 0 0 430 450 z"></path>
							</svg>
						)} */}
						<img src={artworkDetails?.imageUrl} alt="" className="self-center" />
					</div>

					<div className="h-1/2 bottom-0 fixed bg-[#1d1020] text-[#F2E9E4] md:h-full w-full md:w-[365px] overflow-y-auto md:right-0 p-5 md:pt-[76px] space-y-4">
						<div className="flex flex-row space-x-3 relative">
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
											className="text-md cursor-pointer font-semibold text-[#e80059]"
										>
											{user.displayName ?? user.name}
										</div>
										<div className="text-xs text-[#9A8C98] font-medium">{user.headline}</div>
									</div>
									{canEditDelete && (
										<div className="flex flex-row space-x-2 text-xs absolute right-0 text-[#b7094c] py-1">
											<div
												className="cursor-pointer"
												onClick={() => router.push(`/artwork/${artworkDetails?.id}/edit`)}
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
											<div onClick={openModal} className="cursor-pointer">
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

											<Transition appear show={isOpen} as={Fragment}>
												<Dialog
													as="div"
													className="fixed inset-0 z-10 overflow-y-auto"
													onClose={closeModal}
												>
													<div className="min-h-screen px-4 text-center">
														<Transition.Child
															as={Fragment}
															enter="ease-out duration-300"
															enterFrom="opacity-0"
															enterTo="opacity-100"
															leave="ease-in duration-200"
															leaveFrom="opacity-100"
															leaveTo="opacity-0"
														>
															<Dialog.Overlay className="fixed inset-0" />
														</Transition.Child>

														{/* This element is to trick the browser into centering the modal contents. */}
														<span
															className="inline-block h-screen align-middle"
															aria-hidden="true"
														>
															&#8203;
														</span>
														<Transition.Child
															as={Fragment}
															enter="ease-out duration-300"
															enterFrom="opacity-0 scale-95"
															enterTo="opacity-100 scale-100"
															leave="ease-in duration-200"
															leaveFrom="opacity-100 scale-100"
															leaveTo="opacity-0 scale-95"
														>
															<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden  align-middle transition-all transform bg-gray-900 shadow-xl rounded-sm ">
																<Dialog.Title
																	as="h3"
																	className="text-lg font-medium leading-6 text-[#E63E6D] flex items-center justify-center"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-12 w-12"
																		viewBox="0 0 20 20"
																		fill="currentColor"
																	>
																		<path
																			fillRule="evenodd"
																			d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</Dialog.Title>
																<div className="mt-2">
																	<p className="text-sm text-white">
																		Are you sure you want to delete this art?
																	</p>
																</div>

																<div className="mt-4 flex flex-row justify-around">
																	<button
																		type="button"
																		className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
																		onClick={closeModal}
																	>
																		Nevermind
																	</button>
																	<button
																		type="button"
																		className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
																		onClick={onDelete}
																	>
																		Delete Artwork
																	</button>
																</div>
															</div>
														</Transition.Child>
													</div>
												</Dialog>
											</Transition>
										</div>
									)}
								</>
							)}
						</div>
						{session && (
							<div className="flex flex-row items-center text-[#22223B] space-x-2">
								{liked ? (
									<div
										onClick={handleUnlike}
										className="bg-[#3bbfff] w-1/5 rounded-sm cursor-pointer py-1 px-8 flex flex-row text-xs justify-center items-center space-x-1"
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
								) : (
									<div
										onClick={handleLike}
										className="bg-[#3bbfff] w-1/5 rounded-sm cursor-pointer py-1 px-3 flex flex-row text-xs justify-center items-center space-x-1"
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
								)}
								<FollowButton userId={artworkDetails?.authorId} />
							</div>
						)}

						<div className="flex flex-col space-y-2">
							<div className="text-4xl font-semibold text-[#e80059]">{artworkDetails?.title}</div>

							<Linkify
								componentDecorator={(decoratedHref, decoratedText, key) => (
									<a target="_blank" href={decoratedHref} key={key} style={{ color: '#3bbfff' }}>
										{decoratedText}
									</a>
								)}
							>
								<div className="text-sm pb-2 break-words whitespace-pre-line ">
									{artworkDetails?.description}
								</div>
							</Linkify>

							<div className="text-xs text-[#9A8C98] italic flex flex-row space-x-1">
								<div>Posted {getRelativeDate(artworkDetails?.createdAt)} under</div>

								<span
									onClick={() => router.push(`/${artworkDetails?.section?.toLowerCase()}`)}
									className="text-xs font-semibold text-[#b7094c] rounded-sm cursor-pointer hover:text-[#F2E9E4]"
								>
									{artworkDetails?.section}
								</span>
							</div>
							<div className="flex flex-row justify-between ">
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

									<div className="text-xs">{artworkDetails?.viewCount} views</div>
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
									<div className="text-xs">{artworkDetails?.likeCount} likes</div>
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

						<hr className="border-[#9A8C98]" />

						<div className="sm:text-center md:text-left">
							<div className="text-sm mb-2 font-medium">More by {user?.displayName ?? user?.name}</div>
							<div className="max-w-[443px] mx-auto">
								<MoreByGrid userId={artworkDetails?.authorId} />
							</div>
						</div>

						<TagsGrid tags={artworkDetails?.tags} />

						<hr className="border-[#9A8C98]" />

						{/* Comments Section */}
						<div className="flex flex-col w-full space-y-2">
							{commentIsLoading && (
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
							)}
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
								className="space-y-4 flex flex-col text-gray-300 w-full bg-[#1d1020]"
							>
								<textarea
									id="comment"
									placeholder="Share a comment or provide feedback!"
									{...register('content', { required: true, maxLength: 130 })}
									className="border border-[#b7094c] rounded-sm text-sm w-full p-2.5 bg-[#1b1528]  transition-all focus:outline-none focus:border-[#F2E9E4] placeholder:text-[#9A8C98] placeholder:font-medium focus:text-[#F2E9E4] focus:font-medium text-[#F2E9E4] font-medium"
								/>

								<input
									disabled={formState.isSubmitting}
									className="p-2 rounded-md bg-[#b7094c] w-32 text-xs font-semibold cursor-pointer"
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
