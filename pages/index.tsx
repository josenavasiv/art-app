import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';

import { InferGetServerSidePropsType } from 'next';

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
	const { data: session, status } = useSession();

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<h1 className="text-3xl font-bold underline text-[#D3DBFF]">Hello world!</h1>
				<h1 className="text-3xl font-bold underline text-[#FFDADA]">Hello world!</h1>
				<h1 className="text-3xl font-bold underline text-[#DB6B97]">Hello world!</h1>
				<h1 className="text-3xl font-bold underline text-[#E63E6D]">Hello world!</h1>
				<button onClick={() => signIn()} className="bg-white p-2">
					SIGN IN
				</button>
				<button onClick={() => signOut()} className="bg-white p-2">
					SIGN OUT
				</button>
				<button onClick={() => router.push('/api/hello')} className="bg-white p-2">
					API HELLO
				</button>
				<button onClick={() => router.push('/profile/cl253ie2g0008jktshzr9lvwv')} className="bg-white p-2">
					PROFILE (HARD CODED)
				</button>
			</div>
			<ArtworkGrid artworks={commmunityImages} />
		</>
	);
};

export default Home;
