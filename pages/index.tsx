import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { InferGetServerSidePropsType } from 'next';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { getRelativeDate } from '../lib/relativeTime';

export const getServerSideProps: GetServerSideProps = async () => {
	// const params = new URLSearchParams({ section: 'COMMUNITY' });
	// const commmunityImages = await fetch(`http://localhost:3000/api/upload?${params}`, {
	// 	method: 'GET',
	// 	headers: { 'Content-Type': 'application/json' },
	// });
	const data = await prisma.artwork.findMany({
		where: { section: 'COMMUNITY' },
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
				<h1 className="text-3xl font-bold text-[#E63E6D] p-3">Home.</h1>

				<button onClick={() => signIn()} className="bg-white p-2">
					SIGN IN
				</button>
				<button onClick={() => signOut()} className="bg-white p-2">
					SIGN OUT
				</button>
				<button onClick={() => router.push('/api/hello')} className="bg-white p-2">
					API HELLO
				</button>
				<button onClick={() => router.push(`/profile/${loggedInUser.id}`)} className="bg-white p-2">
					PROFILE
				</button>
				<button onClick={() => router.push(`/profile/${loggedInUser.id}/edit`)} className="bg-white p-2">
					PROFILE EDIT
				</button>
			</div>
			<ArtworkGrid artworks={commmunityImages} />
		</>
	);
};

export default Home;
