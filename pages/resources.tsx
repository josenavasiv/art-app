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
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	// console.log(session);

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});
	// console.log(userResult);

	// This is how the mature content is filtered out
	const data = await prisma.artwork.findMany({
		take: 10,
		where: {
			OR: [
				{ section: 'RESOURCES', mature: false },
				{ section: 'RESOURCES', mature: userResult?.showMatureContent || false },
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const communityImages = JSON.parse(JSON.stringify(data));
	// console.log(commmunityImages); An array of objects (Upload Prisma)
	return {
		props: {
			communityImages,
		},
	};
};

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

const resources: NextPage = ({ communityImages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { ref, inView } = useInView();

	const { data, error, mutate, size, setSize } = useSWRInfinite(
		(index) => `/api/artworks?page=${index + 1}&section=COMMUNITY`,
		fetcher
	);

	const artworks = data ? [].concat(...communityImages, ...data) : []; // Add onto our current artworks on each request
	const isLoadingInitialData = !data && !error;

	useEffect(() => {
		if (inView && data?.[data.length - 1]?.length !== 0) {
			setSize(size + 1); // Setting the page to fetch
		}
	}, [inView]);

	return (
		<>
			<Head>
				<title>Resources</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Resources.</h1>
					<h1 className="text-xl font-bold text-[#e80059] p-3 ">
						Resource creation and displaying is currently a work in progress...
					</h1>
				</div>
			</div>

			<ArtworkGrid artworks={artworks} />

			<div ref={ref} className="text-white mt-[750px] text-center">
				Intersection Observer Marker
			</div>
		</>
	);
};

export default resources;

// getServerSideProps gets the initial 50 or so artworks
// After that, userSWRInifinite fetches the reset of the artworks by pages
// Every page contains 50 elements, and skips by 50 elements
// React-Intersection-Observer is used to get create the other /api/artworks calls
