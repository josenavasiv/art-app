import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';

const Custom404: NextPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>404 Page Not Found</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className="flex flex-col items-center min-h-screen w-full justify-center relative">
				<div className="h-12 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-4xl font-bold text-[#E9D8A6] p-3 z-10 ">404</h1>
					<h1 className="text-4xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">404</h1>
				</div>
				<div className="h-12 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-2xl font-bold text-[#E9D8A6] p-3 z-10 ">Page Not Found</h1>
					<h1 className="text-2xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">Page Not Found</h1>
				</div>

				<div className="mt-2">
					<div className="relative">
						<div
							onClick={() => router.push('/')}
							className="w-full border-[#E9D8A6] text-[#E9D8A6] border-2 p-2 md:p-3 rounded-sm font-semibold text-sm md:text-lg cursor-pointer"
						>
							Home.
						</div>
						<div className="w-full absolute top-0 ml-[2px] mt-[2px] -z-10 border-[#403DE3] text-[#403DE3] border-2 p-2 md:p-3 rounded-sm font-semibold text-sm md:text-lg">
							Home.
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Custom404;
