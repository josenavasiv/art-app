import { GetServerSideProps } from 'next';
import { InferGetServerSidePropsType } from 'next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import prisma from '../../../lib/prisma';
import Navbar from '../../../components/Navbar';
import ArtworkGrid from '../../../components/ArtworkGrid';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.query.id as string; // Get over TypeScript string issue

	const userDetailsData = await prisma.user.findUnique({
		where: { id: id },
	});
	const userDetails = JSON.parse(JSON.stringify(userDetailsData));
	// console.log(userDetails);

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
				<div className="flex flex-col h-[320px] w-full items-center justify-center relative overflow-hidden">
					<img className="rounded-full w-28 h-28" src={userDetails.avatar ?? userDetails.image} alt="" />
					<div className="text-3xl font-semibold text-[#E63E6D]">
						{userDetails.displayName ?? userDetails.name}
					</div>
					<div className="text-sm font-medium text-[#E63E6D]">{userDetails.headline}</div>
					<img className="absolute -z-10 object-cover" src={userDetails?.backgroundImageUrl} alt="" />
				</div>
			</div>

			<Tabs className="text-gray-300 z-10 mt-2 w-full">
				<TabList className="font-semibold text-center">
					<Tab>About</Tab>
					<Tab>Artwork</Tab>
					<Tab>Likes</Tab>
					<Tab>Following</Tab>
					<Tab>Followers</Tab>
				</TabList>

				<TabPanel>
					<h2>About</h2>
				</TabPanel>
				<TabPanel>
					<ArtworkGrid artworks={userArtworks} />
				</TabPanel>
				<TabPanel>
					<h2>Likes</h2>
				</TabPanel>
				<TabPanel>
					<h2>Following</h2>
				</TabPanel>
				<TabPanel>
					<h2>Followers</h2>
				</TabPanel>
			</Tabs>
		</>
	);
};

export default index;
