import React from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import useLoggedInUser from '../hooks/useLoggedInUser';
import NavbarDropdown from './NavbarDropdown';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

const Navbar: React.FC = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	// SWR into database with useEffect when session status changes
	const { loggedInUser, isLoading, isError } = useLoggedInUser();
	// console.log(loggedInUser);

	const onSubmit = (data: string) => {
		router.push(`/search?searchQuery=${data.search}`);
		return;
	};

	if (!loggedInUser) {
		return (
			<nav className="w-full h-14 space-x-3 bg-[#04041c] flex flex-row text-[#F2E9E4] text-xs md:text-sm font-medium sticky top-0 z-50">
				<div
					onClick={() => router.push('/')}
					className="w-36 self-center ml-3 flex flex-row space-x-2 p-2 cursor-pointer"
				>
					<Image src="/art-app-placeholder-icon.png" alt="me" width="28" height="28" />

					<p className="self-center font-bold">BRANDHERE</p>
				</div>

				<div className="grow self-center">
					{/* @ts-ignore */}
					<form onSubmit={handleSubmit(onSubmit)}>
						<input
							{...register('search')}
							className="w-full h-9 bg-[#04041c] border-[#F2E9E4] py-2 px-3 border-b-2 focus:border-[#e80059] focus:text-[#e80059] focus:outline-none transition-all placeholder:font-semibold font-semibold placeholder:text-[#F2E9E4] text-[#F2E9E4] text-xs"
							type="text"
							name="search"
							id="search"
							placeholder="Search artworks via tags or title"
						/>
						<input type="submit" className="hidden" />
					</form>
				</div>

				<div onClick={() => signIn()} className="flex flex-row items-center space-x-6 pr-6 pl-3">
					<button className="w-18 flex flex-row space-x-1 hover:text-[#e80059]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 hidden md:block"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="self-center font-semibold hover:text-[#e80059]">LOGIN</p>
					</button>
					<button className="w-18 flex flex-row space-x-1 bg-[#F2E9E4] hover:bg-[#e80059] hover:text-[#F2E9E4] text-[#1b1528] px-[0.5rem] py-[0.3rem] rounded-md">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 hidden md:block"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="self-center font-semibold">REGISTER</p>
					</button>
				</div>
			</nav>
		);
	}

	return (
		<nav className="w-full h-14 space-x-3 bg-[#04041c] flex flex-row text-[#F2E9E4] text-xs md:text-sm font-medium sticky top-0 z-50">
			<div
				onClick={() => router.push('/')}
				className="w-36 self-center ml-3 flex flex-row space-x-2 p-2 cursor-pointer"
			>
				<Image src="/art-app-placeholder-icon.png" alt="me" width="28" height="28" />

				<p className="self-center font-bold">BRANDHERE</p>
			</div>

			<div className="grow self-center block md:hidden"></div>

			<div className="grow self-center hidden md:block">
				{/* @ts-ignore */}
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
						{...register('search')}
						className="w-full h-9 bg-[#04041c] border-[#F2E9E4] py-2 px-3 border-b-2 focus:border-[#e80059] focus:text-[#e80059] focus:outline-none transition-all placeholder:font-semibold font-semibold placeholder:text-[#F2E9E4] text-[#F2E9E4] text-xs"
						type="text"
						name="search"
						id="search"
						placeholder="Search artworks via tags or title"
					/>
					<input type="submit" className="hidden" />
				</form>
			</div>

			<div className="flex flex-row items-center space-x-3 pr-3 bg-accent-primary relative">
				<button
					className="w-18 flex flex-row space-x-1.5 hover:text-[#403DE3]"
					onClick={() => router.push('/upload')}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
							clipRule="evenodd"
						/>
					</svg>

					<p className="self-center font-semibold ">Upload</p>
				</button>

				<NavbarDropdown userId={loggedInUser?.id} userImageUrl={loggedInUser?.avatar || loggedInUser?.image} />
			</div>
		</nav>
	);
};

export default Navbar;
