import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import prisma from '../../../lib/prisma';
import Navbar from '../../../components/Navbar';
import ArtworkGrid from '../../../components/ArtworkGrid';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.query.id as string; // Get over TypeScript string issue

	const userDetailsData = await prisma.user.findFirst({
		where: { id: id },
	});
	const userDetails = JSON.parse(JSON.stringify(userDetailsData));
	console.log(userDetails);

	// Need to grab the user's images
	const userArtworksData = await prisma.artwork.findMany({
		where: { authorId: id },
	});
	const userArtworks = JSON.parse(JSON.stringify(userArtworksData));
	// console.log(userArtworks);

	return {
		props: {
			userDetails,
			userArtworks,
		},
	};
};

// Need to create async function that gets userlikes, maybe change get userArtworks to be obtained with swr

const index: React.FC = ({ userDetails, userArtworks }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Navbar />

			<div className="flex justify-center">
				<div className="flex flex-col max-w-[1400px] w-full items-center justify-center">
					<p className="text-[#DB6B97]">{userDetails.name}</p>
					<img className="rounded-full" src={userDetails.image} alt="" />
				</div>
			</div>
			<Tabs className="text-gray-300 mt-6">
				<TabList className="font-semibold text-center">
					<Tab>Uploads</Tab>
					<Tab>Likes</Tab>
				</TabList>

				<TabPanel>
					<ArtworkGrid artworks={userArtworks} />
				</TabPanel>
				<TabPanel>
					<h2>Any content 2</h2>
				</TabPanel>
			</Tabs>
		</>
	);
};

export default index;
