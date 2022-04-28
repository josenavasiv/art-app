import React, { useEffect } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { useInView } from 'react-intersection-observer';
import useSWRInfinite from 'swr/infinite';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});

	const data = await prisma.artwork.findMany({
		take: 10,
		where: {
			OR: [
				{ section: 'FEEDBACK', mature: false },
				{ section: 'FEEDBACK', mature: userResult?.showMatureContent || false },
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const feedbackImages = JSON.parse(JSON.stringify(data));
	// console.log(commmunityImages); An array of objects (Upload Prisma)
	return {
		props: {
			feedbackImages,
		},
	};
};

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

const feedback: NextPage = ({ feedbackImages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { ref, inView } = useInView();

	const { data, error, mutate, size, setSize } = useSWRInfinite(
		(index) => `/api/artworks?page=${index + 1}&section=FEEDBACK`,
		fetcher
	);

	const feedbackArtworks = data ? [].concat(...feedbackImages, ...data) : []; // Add onto our current artworks on each request
	const isLoadingInitialData = !data && !error;

	useEffect(() => {
		if (inView && data?.[data.length - 1]?.length !== 0) {
			setSize(size + 1); // Setting the page to fetch
		}
	}, [inView]);

	return (
		<>
			<Head>
				<title>Feedback</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Feedback.</h1>
				</div>
			</div>

			<ArtworkGrid artworks={feedbackArtworks} />

			<div ref={ref} className="text-white mt-[750px] text-center">
				Intersection Observer Marker
			</div>
		</>
	);
};

export default feedback;
