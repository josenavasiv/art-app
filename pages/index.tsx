import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';

import Navbar from '../components/Navbar';
import ArtworkGrid from '../components/ArtworkGrid';
import Head from 'next/head';

import useAllArtworks from '../hooks/useAllArtworks';

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

// const Home: NextPage = ({ allArtworks }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const Home: NextPage = () => {
	const router = useRouter();
	const { ref, inView } = useInView();

	const { allArtworks, isLoading } = useAllArtworks();

	const { data, error, mutate, size, setSize } = useSWRInfinite(
		(index) => `/api/artworks?page=${index + 1}&section=COMMUNITY`,
		fetcher
	);

	let artworks = [];
	if (allArtworks) {
		artworks = [...allArtworks];
	}

	if (data) {
		artworks.concat(...data);
	}
	// const artworks = data ? [].concat(...allArtworks, ...data) : []; // Add onto our current artworks on each request
	const isLoadingInitialData = !data && !error;

	useEffect(() => {
		if (inView && data?.[data.length - 1]?.length !== 0) {
			setSize(size + 1); // Setting the page to fetch
		}
	}, [inView]);

	return (
		<>
			<Head>
				<title>Home</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center">
				<div className="h-24 w-full flex flex-col justify-center items-center space-y-2 p-4">
					<div className="h-24 flex flex-col justify-center items-center p-4 relative">
						<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">Home.</h1>
						<h1 className="text-3xl font-bold text-[#403DE3] p-3 absolute ml-[5px] mt-[5px]">Home.</h1>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				{isLoading && (
					<div className="font-medium flex flex-row justify-center items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							width="256"
							height="256"
							viewBox="0 0 520 520"
							style={{ fill: '#F2E9E4' }}
							className="animate-pulse "
						>
							<path d="M 365 30 C 345.701 30 330 45.701 330 65 C 330 84.299 345.701 100 365 100 C 384.299 100 400 84.299 400 65 C 400 45.701 384.299 30 365 30 z M 260 50 A 10 10 0 0 0 260 70 A 10 10 0 0 0 260 50 z M 365 50 C 373.271 50 380 56.729 380 65 C 380 73.271 373.271 80 365 80 C 356.729 80 350 73.271 350 65 C 350 56.729 356.729 50 365 50 z M 460 60 A 10 10 0 0 0 460 80 A 10 10 0 0 0 460 60 z M 131.01172 77.285156 C 110.57018 77.739112 91.872641 91.343984 85.931641 112.00586 L 83.71875 119.70508 C 65.29975 125.15308 51.816406 142.21495 51.816406 162.37695 L 51.816406 230.66797 L 33.908203 292.94922 C 28.324203 312.37222 35.796453 333.32958 51.814453 345.01758 L 51.814453 357.62109 C 51.814453 382.15809 71.777453 402.12109 96.314453 402.12109 L 239.97656 402.12109 L 374.69336 440.85352 C 400.16036 448.17852 426.73636 433.50114 434.06836 407.99414 L 436.28125 400.29492 C 454.70025 394.84692 468.18359 377.78309 468.18359 357.62109 L 468.18359 289.33008 L 486.08984 227.04883 C 491.67484 207.62583 484.20355 186.67142 468.18555 174.98242 L 468.18555 162.37695 C 468.18555 137.83895 448.22255 117.87695 423.68555 117.87695 L 280.02539 117.87695 L 145.30664 79.146484 C 140.53908 77.775672 135.729 77.180397 131.01172 77.285156 z M 60 80 A 10 10 0 0 0 60 100 A 10 10 0 0 0 60 80 z M 131.44336 97.279297 C 134.19474 97.218398 137.00025 97.567125 139.78125 98.367188 L 207.64258 117.87695 L 105.05273 117.87695 L 105.15234 117.5293 C 108.61603 105.47992 119.52072 97.543191 131.44336 97.279297 z M 423.68555 137.87891 C 437.19555 137.87891 448.18555 148.86991 448.18555 162.37891 L 448.18555 357.62305 C 448.18555 368.97805 440.41892 378.55241 429.91992 381.31641 C 427.97892 381.03341 426.05747 381.33047 424.35547 382.10547 C 423.38247 382.13047 99.530406 382.12305 96.316406 382.12305 C 82.807406 382.12305 71.816406 371.13305 71.816406 357.62305 L 71.816406 162.37695 C 71.816406 151.02695 79.575406 141.4565 90.066406 138.6875 C 92.000406 138.9725 93.889578 138.69053 95.642578 137.89453 C 96.581578 137.86853 320.95955 137.88191 423.68555 137.87891 z M 100 160 C 94.477 160 90 164.477 90 170 L 90 350 C 90 355.522 94.477 360 100 360 L 420 360 C 425.522 360 430 355.522 430 350 L 430 170 C 430 164.477 425.522 160 420 160 L 100 160 z M 110 180 L 410 180 L 410 200 L 360 200 C 354.478 200 350 204.477 350 210 C 350 215.523 354.478 220 360 220 L 410 220 L 410 340 L 394.72852 340 L 315.58594 243.65234 C 311.59994 238.79934 304.17983 238.79056 300.17383 243.60156 L 259.43164 292.5293 L 219.28125 243.65234 C 215.28825 238.79234 207.83217 238.77634 203.82617 243.65234 L 124.68555 340 L 110 340 L 110 270 L 130 270 C 135.523 270 140 265.522 140 260 C 140 254.477 135.523 250 130 250 L 110 250 L 110 180 z M 260 190 C 243.458 190 230 203.458 230 220 C 230 236.542 243.458 250 260 250 C 276.542 250 290 236.542 290 220 C 290 203.458 276.542 190 260 190 z M 330 200 A 10 10 0 0 0 330 220 A 10 10 0 0 0 330 200 z M 260 210 C 265.514 210 270 214.486 270 220 C 270 225.514 265.514 230 260 230 C 254.486 230 250 225.514 250 220 C 250 214.486 254.486 210 260 210 z M 160 250 A 10 10 0 0 0 160 270 A 10 10 0 0 0 160 250 z M 307.80664 265.69141 L 368.8457 340 L 298.42383 340 L 272.35547 308.26562 L 307.80664 265.69141 z M 211.55469 265.75586 C 218.51669 274.23086 265.52306 331.459 272.53906 340 L 150.56836 340 L 211.55469 265.75586 z M 312.35742 402.12305 L 414.94727 402.12305 L 414.84766 402.4707 C 410.58366 417.3007 395.05075 425.89477 380.21875 421.63477 L 312.35742 402.12305 z M 50 420 A 10 10 0 0 0 50 440 A 10 10 0 0 0 50 420 z M 150 420 C 133.458 420 120 433.458 120 450 C 120 466.542 133.458 480 150 480 C 166.542 480 180 466.542 180 450 C 180 433.458 166.542 420 150 420 z M 240 430 A 10 10 0 0 0 240 450 A 10 10 0 0 0 240 430 z M 150 440 C 155.514 440 160 444.486 160 450 C 160 455.514 155.514 460 150 460 C 144.486 460 140 455.514 140 450 C 140 444.486 144.486 440 150 440 z M 430 450 A 10 10 0 0 0 430 470 A 10 10 0 0 0 430 450 z"></path>
						</svg>
					</div>
				)}
			</div>

			<ArtworkGrid artworks={artworks} />

			<div ref={ref} className="text-white mt-[750px] text-center">
				Intersection Observer Marker
			</div>
		</>
	);
};

export default Home;

// getServerSideProps gets the initial 50 or so artworks
// After that, userSWRInifinite fetches the reset of the artworks by pages
// Every page contains 50 elements, and skips by 50 elements
// React-Intersection-Observer is used to get create the other /api/artworks calls
