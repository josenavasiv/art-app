import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { Tab } from '@headlessui/react';
import Linkify from 'react-linkify';
import Image from 'next/image';

import { getSession } from 'next-auth/react';

import prisma from '../../../lib/prisma';
import Navbar from '../../../components/Navbar';
import ArtworkGrid from '../../../components/ArtworkGrid';
import FollowerProfile from '../../../components/FollowerProfile';
import Head from 'next/head';

// @ts-ignore
function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
	const session = await getSession(context);

	const sessionResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});

	const id = context.query.id as string; // Get over TypeScript string issue

	const userDetailsData = await prisma.user.findUnique({
		where: { id: id },
	});
	const userDetails = JSON.parse(JSON.stringify(userDetailsData));
	// console.log(userDetails);

	// Need to grab the user's images
	const userArtworksData = await prisma.artwork.findMany({
		where: {
			OR: [
				{ authorId: id, mature: false },
				{ authorId: id, mature: sessionResult?.showMatureContent || false },
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	const userArtworks = JSON.parse(JSON.stringify(userArtworksData));
	// console.log(userArtworks);

	const userLikes = await prisma.like.findMany({
		where: {
			authorId: id,
		},
	});
	// console.log(userLikes);

	const userLikesArtworks = [];
	for await (const userLike of userLikes) {
		const result = await prisma.artwork.findUnique({
			where: {
				id: userLike.artworkId,
			},
		});
		// If logged-in user has show mature content true, just show every liked artwork
		if (sessionResult?.showMatureContent === true) {
			userLikesArtworks.push(result);
		} else {
			// If user not logged in or has show mature content false, only add artworks with mature as false
			if (result?.mature === false) {
				userLikesArtworks.push(result);
			}
		}
	}
	const userLikesArtworksParsed = JSON.parse(JSON.stringify(userLikesArtworks));
	// console.log(userLikesArtworksParsed);

	// Get all of the current user's followers
	// Pass the followerIds to the followerGrid
	const userFollowers = await prisma.follows.findMany({
		where: {
			followingId: id,
		},
		// CAN ADD NOT userId === followerId
	});
	// Get all of the current user's followings
	// Pass the followingIds to the followerGrid

	const userFollowing = await prisma.follows.findMany({
		where: {
			followerId: id,
		},
		// CAN ADD NOT userId === followingId
	});

	return {
		props: {
			userDetails,
			userArtworks,
			userLikesArtworksParsed,
			userFollowers,
			userFollowing,
		},
	};
};

// Need to create async function that gets userlikes, maybe change get userArtworks to be obtained with swr

const index: React.FC = ({
	userDetails,
	userArtworks,
	userLikesArtworksParsed,
	userFollowers,
	userFollowing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Head>
				<title>Profile - {userDetails.displayName ?? userDetails.name}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />

			<div className="flex justify-center">
				<div className="flex flex-col h-[350px] w-full items-center justify-center relative overflow-hidden">
					<img className="rounded-full w-28 h-28 mb-3" src={userDetails.avatar ?? userDetails.image} alt="" />
					<div className="text-3xl font-semibold text-[#E9D8A6] z-10">
						{userDetails.displayName ?? userDetails.name}
					</div>
					<div className="text-3xl font-semibold text-[#403DE3] absolute mt-[97.5px] ml-[5px]">
						{userDetails.displayName ?? userDetails.name}
					</div>
					<div className="text-sm font-semibold text-[#E9D8A6] mb-[10px] z-10">{userDetails.headline}</div>

					<div className="text-sm font-semibold text-[#403DE3] absolute mt-[152.5px] ml-[3px]">
						{userDetails.headline}
					</div>
					<img className="absolute -z-10 object-cover w-full" src={userDetails?.backgroundImageUrl} alt="" />
				</div>
			</div>

			<div className="text-gray-300 z-10 mt-4 w-full">
				<Tab.Group>
					<Tab.List className="flex p-1 space-x-1 rounded-sm mx-4 text-xs">
						<Tab
							className={({ selected }) =>
								classNames(
									'w-full py-2.5 md:text-sm leading-5 font-medium text-[#F2E9E4] rounded-sm',
									'focus:outline-none ',
									selected
										? 'bg-[#403DE3]'
										: 'text-amber-100 hover:bg-[#e80059]/[0.12] hover:text-white'
								)
							}
						>
							Artwork
						</Tab>
						<Tab
							className={({ selected }) =>
								classNames(
									'w-full py-2.5 md:text-sm leading-5 font-medium text-[#F2E9E4] rounded-sm',
									'focus:outline-none ',
									selected
										? 'bg-[#403DE3]'
										: 'text-amber-100 hover:bg-[#e80059]/[0.12] hover:text-white'
								)
							}
						>
							Likes
						</Tab>
						<Tab
							className={({ selected }) =>
								classNames(
									'w-full py-2.5 md:text-sm leading-5 font-medium text-[#F2E9E4] rounded-sm',
									'focus:outline-none ',
									selected
										? 'bg-[#403DE3]'
										: 'text-amber-100 hover:bg-[#e80059]/[0.12] hover:text-white'
								)
							}
						>
							Following
						</Tab>
						<Tab
							className={({ selected }) =>
								classNames(
									'w-full py-2.5 md:text-sm leading-5 font-medium text-[#F2E9E4] rounded-sm',
									'focus:outline-none ',
									selected
										? 'bg-[#403DE3]'
										: 'text-amber-100 hover:bg-[#e80059]/[0.12] hover:text-white'
								)
							}
						>
							Followers
						</Tab>
						<Tab
							className={({ selected }) =>
								classNames(
									'w-full py-2.5 md:text-sm leading-5 font-medium text-[#F2E9E4] rounded-sm',
									'focus:outline-none ',
									selected
										? 'bg-[#403DE3]'
										: 'text-amber-100 hover:bg-[#e80059]/[0.12] hover:text-white'
								)
							}
						>
							About
						</Tab>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel>
							<div className="h-16 flex flex-col justify-center items-center p-4 relative">
								<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
									{userDetails?.displayName ?? userDetails?.name}'s Artworks
								</h1>
								<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">
									{userDetails?.displayName ?? userDetails?.name}'s Artworks
								</h1>
							</div>

							{userArtworks.length === 0 && (
								<div className="w-full h-full flex flex-col justify-center items-center">
									<div className=" w-full flex flex-col justify-center items-center space-y-2 p-4">
										<Image src="/cricket.png" width="128" height="128" />
										<h1 className="text-2xl font-bold text-[#e80059] ">*Cricket Noises*</h1>
										<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
											{userDetails?.displayName ?? userDetails?.name} should upload some art...
										</h1>
									</div>
								</div>
							)}

							<ArtworkGrid artworks={userArtworks} />
						</Tab.Panel>
						<Tab.Panel>
							<div className="h-16 flex flex-col justify-center items-center p-4 relative">
								<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
									{userDetails?.displayName ?? userDetails?.name}'s Favorite Artworks
								</h1>
								<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">
									{userDetails?.displayName ?? userDetails?.name}'s Favorite Artworks
								</h1>
							</div>

							{userLikesArtworksParsed.length === 0 && (
								<div className="w-full h-full flex flex-col justify-center items-center">
									<div className=" w-full flex flex-col justify-center items-center space-y-2 p-4">
										<Image src="/cricket.png" width="128" height="128" />
										<h1 className="text-2xl font-bold text-[#e80059] ">*Cricket Noises*</h1>
										<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
											{userDetails?.displayName ?? userDetails?.name} hasn't liked anything yet...
										</h1>
									</div>
								</div>
							)}

							<ArtworkGrid artworks={userLikesArtworksParsed} />
						</Tab.Panel>
						<Tab.Panel>
							<div className="h-16 flex flex-col justify-center items-center p-4 relative">
								<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
									{userDetails?.displayName ?? userDetails?.name}'s Followings
								</h1>
								<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">
									{userDetails?.displayName ?? userDetails?.name}'s Followings
								</h1>
							</div>

							{userFollowing.length === 0 && (
								<div className="w-full h-full flex flex-col justify-center items-center">
									<div className=" w-full flex flex-col justify-center items-center space-y-2 p-4">
										<Image src="/cricket.png" width="128" height="128" />
										<h1 className="text-2xl font-bold text-[#e80059] ">*Cricket Noises*</h1>
										<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
											Looks like {userDetails?.displayName ?? userDetails?.name} hasn't followed
											anyone yet...
										</h1>
									</div>
								</div>
							)}

							<div className="w-full followers-grid p-4">
								{userFollowing.map((following: string) => (
									// @ts-ignore
									<FollowerProfile key={following.followerId} userId={following.followingId} />
								))}
							</div>
						</Tab.Panel>
						<Tab.Panel>
							<div className="h-16 flex flex-col justify-center items-center p-4 relative">
								<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
									{userDetails?.displayName ?? userDetails?.name}'s Followers
								</h1>
								<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">
									{userDetails?.displayName ?? userDetails?.name}'s Followers
								</h1>
							</div>

							{userFollowers.length === 0 && (
								<div className="w-full h-full flex flex-col justify-center items-center">
									<div className=" w-full flex flex-col justify-center items-center space-y-2 p-4">
										<Image src="/cricket.png" width="128" height="128" />
										<h1 className="text-2xl font-bold text-[#e80059] ">*Cricket Noises*</h1>
										<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
											Looks like {userDetails?.displayName ?? userDetails?.name} hasn't had anyone
											follow them anyone yet...
										</h1>
									</div>
								</div>
							)}

							<div className="w-full followers-grid p-4">
								{userFollowers.map((follower: string) => (
									// @ts-ignore
									<FollowerProfile key={follower.followerId} userId={follower.followerId} />
								))}
							</div>
						</Tab.Panel>
						<Tab.Panel>
							<div className="h-16 flex flex-col justify-center items-center p-4 relative">
								<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
									{userDetails?.displayName ?? userDetails?.name}'s Biography
								</h1>
								<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">
									{userDetails?.displayName ?? userDetails?.name}'s Biography
								</h1>
							</div>

							<div className="w-full h-full flex flex-col justify-center items-center space-y-4">
								<Linkify
									componentDecorator={(decoratedHref, decoratedText, key) => (
										<a target="_blank" href={decoratedHref} key={key} style={{ color: '#3bbfff' }}>
											{decoratedText}
										</a>
									)}
								>
									{userDetails?.bio ? (
										<div className="w-3/5 whitespace-pre-line font-medium mt-2">
											{userDetails?.bio}
										</div>
									) : (
										<div className="w-full h-full flex flex-col justify-center items-center">
											<div className=" w-full flex flex-col justify-center items-center space-y-2 p-4">
												<Image src="/cricket.png" width="128" height="128" />
												<h1 className="text-2xl font-bold text-[#e80059] ">*Cricket Noises*</h1>
												<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
													{userDetails?.displayName ?? userDetails?.name} hasn't added a bio
													yet...
												</h1>
											</div>
										</div>
									)}
								</Linkify>
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</div>
		</>
	);
};

export default index;
