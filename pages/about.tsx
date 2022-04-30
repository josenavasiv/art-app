import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import Image from 'next/image';

const resources: NextPage = () => {
	return (
		<>
			<Head>
				<title>About</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-24 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">About TheArtOfUs.</h1>
					<h1 className="text-3xl font-bold text-[#403DE3] p-3 absolute ml-[5px] mt-[5px]">
						About TheArtOfUs.
					</h1>
				</div>
				<div className="h-4 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-xs sm:text-sm md:text-xl font-bold text-[#E9D8A6] p-3 z-10 ">
						A community for artists of all skill levels...
					</h1>
					<h1 className="text-xs sm:text-sm md:text-xl font-bold secondary-accent p-3 absolute ml-[4px] mt-[4px]">
						A community for artists of all skill levels...
					</h1>
				</div>
				<div className="h-4 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-xs sm:text-sm md:text-xl font-bold text-[#E9D8A6] p-3 z-10 ">
						For those who've have been drawing for a long time...
					</h1>
					<h1 className="text-xs sm:text-sm md:text-xl font-bold secondary-accent p-3 absolute ml-[4px] mt-[4px]">
						For those who've have been drawing for a long time...
					</h1>
				</div>
				<div className="h-4 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-xs sm:text-sm md:text-xl font-bold text-[#E9D8A6] p-3 z-10 ">
						And especially for those just starting out...
					</h1>
					<h1 className="text-xs sm:text-sm md:text-xl font-bold secondary-accent p-3 absolute ml-[4px] mt-[4px]">
						And especially for those just starting out...
					</h1>
				</div>
				{/* <div className="relative mt-10 flex flex-row">
					<img className="w-16 z-10" src="/git1.png" />
					<img className="w-16 -z-10 absolute top-0 ml-[5px] mt-[5px]" src="/git2.png" />

					<h1 className="text-xs sm:text-sm md:text-xl font-bold text-[#E9D8A6] p-3 z-10 ">
						https://github.com/josenavasiv
					</h1>
					<h1 className="text-xs sm:text-sm md:text-xl font-bold secondary-accent p-3 absolute ml-[66px] mt-[2px]">
						https://github.com/josenavasiv
					</h1>
				</div> */}
			</div>
		</>
	);
};

export default resources;

// getServerSideProps gets the initial 50 or so artworks
// After that, userSWRInifinite fetches the reset of the artworks by pages
// Every page contains 50 elements, and skips by 50 elements
// React-Intersection-Observer is used to get create the other /api/artworks calls
