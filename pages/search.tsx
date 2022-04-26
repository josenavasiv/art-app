import { InferGetServerSidePropsType, NextPage } from 'next';
import React from 'react';
import prisma from '../lib/prisma';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import ArtworkGrid from '../components/ArtworkGrid';
import Navbar from '../components/Navbar';
import artworks from './api/artworks';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
	// @ts-ignore
	const searchQuery = context.query.searchQuery?.toLowerCase() ?? '';

	const session = await getSession(context);

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User Not Logged In',
		},
	});

	const data = await prisma.artwork.findMany({
		where: {
			OR: [
				{
					tags: {
						// @ts-ignore
						has: searchQuery,
					},
					mature: false,
				},
				{
					title: {
						// @ts-ignore
						contains: searchQuery,
						mode: 'insensitive',
					},
					mature: false,
				},
				{
					title: {
						// @ts-ignore
						contains: searchQuery,
						mode: 'insensitive',
					},
					mature: userResult?.showMatureContent || false,
				},
				{
					tags: {
						// @ts-ignore
						has: searchQuery,
					},
					mature: userResult?.showMatureContent || false,
				},
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const searchImages = JSON.parse(JSON.stringify(data));

	return {
		props: {
			searchImages,
			searchQuery,
		},
	};
};

const search: NextPage = ({ searchImages, searchQuery }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	console.log(searchImages);
	return (
		<>
			<Head>
				<title>Search</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Search.</h1>
					<h1 className="text-xl font-bold text-[#e80059] p-3 ">Search results for {searchQuery}...</h1>
				</div>
			</div>

			<ArtworkGrid artworks={searchImages} />
		</>
	);
};

export default search;
