import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { InferGetServerSidePropsType } from 'next';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';

import useLoggedInUser from '../hooks/useLoggedInUser';

export const getServerSideProps: GetServerSideProps = async (context) => {
	// const params = new URLSearchParams({ section: 'COMMUNITY' });
	// const commmunityImages = await fetch(`http://localhost:3000/api/upload?${params}`, {
	// 	method: 'GET',
	// 	headers: { 'Content-Type': 'application/json' },
	// });

	const session = await getSession(context);
	console.log(session);

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});
	console.log(userResult);

	// This is how the mature content is filtered out
	const data = await prisma.artwork.findMany({
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

const Home: NextPage = ({ commmunityImages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { loggedInUser, isLoading, isError } = useLoggedInUser();

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#E63E6D] p-3 ">Home.</h1>
				</div>
			</div>

			<ArtworkGrid artworks={commmunityImages} />
		</>
	);
};

export default Home;
