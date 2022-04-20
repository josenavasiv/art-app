// @ts-nocheck
import Navbar from '../components/Navbar';

// For styling purposes of the drop down and modals

export default function Example() {
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

					<div className="fixed bg-white h-full w-[320px] overflow-y-auto right-0 p-5 pt-[76px]">
						<div className="flex flex-row space-x-3 relative">
							{userIsLoading && <div>LOADING USER DETAILS</div>}
							{user && (
								<>
									<img
										onClick={() => router.push(`/profile/${user.id}`)}
										className="rounded-full w-12 h-12 cursor-pointer"
										src={user.image}
										alt=""
									/>
									<div className="flex flex-col">
										<div
											onClick={() => router.push(`/profile/${user.id}`)}
											className="cursor-pointer"
										>
											{user.name}
										</div>
										<div>{user.status}</div>
									</div>
									{/* CHANGE THIS TO DROP DOWN */}
									{canEditDelete && (
										<div className="flex flex-row space-x-2 text-xs absolute right-0 text-[#080808]">
											<button
												onClick={() => router.push(`/artwork/${artworkDetails.id}/edit`)}
												className="bg-[#FFDADA] h-4 w-8 rounded-sm hover:bg-[#fffafa]"
											>
												EDIT
											</button>
											{/* There should be a pop up that warns if you want to delete, then just straight send to the /api/artwork/[id] */}
											<button
												onClick={() => setShowModal(true)}
												className="bg-[#E63E6D] h-4 w-11 rounded-sm hover:bg-[#DB6B97]"
											>
												DELETE
											</button>

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
						<div className="flex flex-row items-center">
							<button className="bg-blue-300 w-1/2 rounded-sm ">Like</button>
						</div>
						<div className="flex flex-col bg-red-200 space-y-2">
							<p>{artworkDetails.title}</p>
							<p>{artworkDetails.description}</p>
							<p>{artworkDetails.createdAt}</p>
							<div className="flex flex-row justify-between">
								<p>{artworkDetails.viewCount} views</p>
								<p>{artworkDetails.likeCount} likes</p>
							</div>
						</div>

						{/* Comments Section */}
						<div className="flex flex-col w-3/4">
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
										/>
									))}
								</>
							)}
						</div>

						{/* Post a Comment Section */}
						{session && (
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-5 flex flex-col text-gray-300 p-4 w-[400px]"
							>
								<div className="space-y-1">
									<textarea
										id="comment"
										placeholder="Share a comment or provide feedback!"
										{...register('content', { required: true, maxLength: 130 })}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									/>
								</div>

								<input
									disabled={formState.isSubmitting}
									className="p-2 rounded-md bg-[#E63E6D] w-32 text-sm font-semibold"
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
}
