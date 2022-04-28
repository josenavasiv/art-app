import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { InferGetServerSidePropsType } from 'next';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';
import Head from 'next/head';

import useAllArtworks from '../hooks/useAllArtworks';

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const { res } = context;
// 	res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);
// 	const session = await getSession(context);
// 	// console.log(session);

// 	const userResult = await prisma.user.findUnique({
// 		where: {
// 			email: session?.user?.email || 'User Not Logged In',
// 		},
// 	});
// 	// console.log(userResult);

// 	// This is how the mature content is filtered out
// 	const data = await prisma.artwork.findMany({
// 		take: 50,
// 		where: {
// 			OR: [{ mature: false }, { mature: userResult?.showMatureContent || false }],
// 		},
// 		orderBy: {
// 			createdAt: 'desc',
// 		},
// 	});

// 	const allArtworks = JSON.parse(JSON.stringify(data));
// 	// console.log(commmunityImages); An array of objects (Upload Prisma)
// 	return {
// 		props: {
// 			allArtworks,
// 		},
// 	};
// };

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

// const Home: NextPage = ({ allArtworks }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const Home: NextPage = () => {
	const router = useRouter();
	const { ref, inView } = useInView();

	const { allArtworks, isLoading } = useAllArtworks();

	const { data, error, mutate, size, setSize } = useSWRInfinite(
		(index) => `/api/artworks?page=${index + 1}&section=COMMUNITY`,
		fetcher
	);

	let artworks = [];
	if (allArtworks) {
		artworks = [...allArtworks];
	}

	if (data) {
		artworks.concat(...data);
	}
	// const artworks = data ? [].concat(...allArtworks, ...data) : []; // Add onto our current artworks on each request
	const isLoadingInitialData = !data && !error;

	useEffect(() => {
		if (inView && data?.[data.length - 1]?.length !== 0) {
			setSize(size + 1); // Setting the page to fetch
		}
	}, [inView]);

	return (
		<>
			<Head>
				<title>Home</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 w-full flex flex-col justify-center items-center space-y-2">
					<h1 className="text-3xl font-bold text-[#e80059] ">WEBSITE NAME</h1>
					<h1 className="text-lg font-medium text-[#F2E9E4] text-center">
						A place where artists of all skill levels can share their artwork!
					</h1>
					<div className="flex flex-row justify-evenly w-full text-[#e80059]">
						<h1
							onClick={() => router.push('/community')}
							className="text-lg font-semibold text-center cursor-pointer hover:text-[#F2E9E4]"
						>
							Community{' '}
						</h1>
						<h1
							onClick={() => router.push('/feedback')}
							className="text-lg font-semibold text-center cursor-pointer hover:text-[#F2E9E4]"
						>
							Feedback{' '}
						</h1>
						<h1
							onClick={() => router.push('/resources')}
							className="text-lg font-semibold text-center cursor-pointer hover:text-[#F2E9E4]"
						>
							Resources{' '}
						</h1>
					</div>
				</div>
			</div>
			{isLoading && (
				<div className="font-medium bg-[#e80059] text-[#F2E9E4] rounded-full flex flex-row justify-center items-center space-x-1">
					<div>Loading Artworks</div>
					<svg
						width="20px"
						height="20px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="animate-spin "
					>
						<path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" fill="white" />
						<path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="white" />
					</svg>
				</div>
			)}
			<ArtworkGrid artworks={artworks} />

			<div ref={ref} className="text-white mt-[750px] text-center">
				Intersection Observer Marker
			</div>
		</>
	);
};

export default Home;

// getServerSideProps gets the initial 50 or so artworks
// After that, userSWRInifinite fetches the reset of the artworks by pages
// Every page contains 50 elements, and skips by 50 elements
// React-Intersection-Observer is used to get create the other /api/artworks calls
