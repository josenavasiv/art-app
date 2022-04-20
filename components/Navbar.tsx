import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import useLoggedInUser from '../hooks/useLoggedInUser';

const Navbar: React.FC = () => {
	// const { data: session, status } = useSession();
	const router = useRouter();

	// console.log(session);
	// SWR into database with useEffect when session status changes
	const { loggedInUser, isLoading, isError } = useLoggedInUser();
	// console.log(loggedInUser);

	if (!loggedInUser) {
		return (
			<nav className="w-full h-14 space-x-3 bg-[#121212] border-b border-gray-600 flex flex-row text-white text-xs font-medium">
				<div
					onClick={() => router.push('/')}
					className="w-36 self-center ml-3 flex flex-row space-x-2 p-2 cursor-pointer"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
							clipRule="evenodd"
						/>
					</svg>
					<p className="self-center font-bold">BRAND HERE</p>
				</div>

				<div className="grow self-center">
					<input
						className="w-full h-9 bg-[#080808] text-gray-600 border border-gray-600 rounded-sm py-2 px-3"
						type="text"
						name="search"
						id="search"
						placeholder="SEARCH_ICON Search..."
					/>
				</div>

				<div onClick={() => signIn()} className="flex flex-row items-center space-x-6 pr-6 pl-3">
					<button className="w-18 flex flex-row space-x-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="self-center font-semibold">SIGN IN</p>
					</button>
					<button className="w-18 flex flex-row space-x-1 bg-[#E63E6D] px-[0.5rem] py-[0.3rem] rounded-md">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="self-center font-semibold">SIGN UP</p>
					</button>
				</div>
			</nav>
		);
	}

	return (
		<nav className="w-full h-14 space-x-3 bg-[#121212] border-b border-gray-600 flex flex-row text-white text-sm font-medium">
			<div
				onClick={() => router.push('/')}
				className="w-36 self-center ml-3 flex flex-row space-x-2 p-2 cursor-pointer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
						clipRule="evenodd"
					/>
				</svg>
				<p className="self-center font-bold">BRAND HERE</p>
			</div>

			<div className="grow self-center">
				<input
					className="w-full h-9 bg-[#080808] text-gray-600 border border-gray-600 rounded-sm py-2 px-3"
					type="text"
					name="search"
					id="search"
					placeholder="SEARCH_ICON Search..."
				/>
			</div>

			<div className="flex flex-row items-center space-x-4 pr-3">
				<button
					className="w-18 flex flex-row space-x-2 hover:text-[#E63E6D]"
					onClick={() => router.push('/upload')}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
							clipRule="evenodd"
						/>
					</svg>

					<p className="self-center">Upload</p>
				</button>
				<button className="w-18 flex flex-row">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</button>
				<button className="w-18 flex flex-row">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</button>
				<div className="w-20 flex flex-row space-x-1">
					<Image
						src={
							loggedInUser?.avatar ||
							loggedInUser?.image ||
							'https://i.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA'
						}
						height="30px"
						width="30px"
						className="rounded-full"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 self-center"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
