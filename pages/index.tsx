import { useEffect } from 'react';
import type { NextPage } from 'next';

import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { InferGetServerSidePropsType } from 'next';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	console.log(session);

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});
	// console.log(userResult);

	// This is how the mature content is filtered out
	const data = await prisma.artwork.findMany({
		take: 50,
		where: {
			OR: [
				{ section: 'COMMUNITY', mature: false },
				{ section: 'COMMUNITY', mature: userResult?.showMatureContent || false },
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const commmunityImages = JSON.parse(JSON.stringify(data));
	// console.log(commmunityImages); An array of objects (Upload Prisma)
	return {
		props: {
			commmunityImages,
		},
	};
};

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = ({ commmunityImages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { ref, inView } = useInView();

	const { data, error, mutate, size, setSize } = useSWRInfinite(
		(index) => `/api/artworks?page=${index + 1}`,
		fetcher
	);

	const artworks = data ? [].concat(...data, ...commmunityImages) : []; // Add onto our current artworks on each request
	const isLoadingInitialData = !data && !error;

	useEffect(() => {
		if (inView && data?.[data.length - 1]?.length !== 0) {
			setSize(size + 1); // Setting the page to fetch
		}
	}, [inView]);

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Home.</h1>
				</div>
			</div>

			{/* <ArtworkGrid artworks={commmunityImages} /> */}
			<ArtworkGrid artworks={artworks} />

			<div ref={ref} className="text-white mt-[1000px]">
				Intersection Observer Marker
			</div>
		</>
	);
};

export default Home;

// getServerSideProps gets the initial 50 or so artworks
// After that, userSWRInifinite fetches the reset of the artworks by pages
// Every page contains 50 elements, and skips by 50 elements
// React-Intersection-Observer is used to get create the other calls
