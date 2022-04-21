import React from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

// @ts-ignore
function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

interface INavbarDropdown {
	userId: string;
	userImageUrl: string;
}

const NavbarDropdown: React.FC<INavbarDropdown> = ({ userId, userImageUrl }) => {
	const router = useRouter();
	return (
		<div className="flex flex-row justify-center items-center z-50">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex justify-center items-center w-full text-white shadow-sm py-2 text-sm font-medium hover:text-[#E63E6D] space-x-0.5">
						<Image src={userImageUrl} height="30px" width="30px" className="rounded-full cursor-pointer " />
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							/>
						</svg>
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="origin-top-right absolute right-0 mt-3 w-36 rounded-sm shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<div
										className={classNames(
											active ? 'text-[#E63E6D] ' : 'text-white',
											'block px-4 py-2 text-sm cursor-pointer'
										)}
										onClick={() => router.push(`/profile/${userId}`)}
									>
										View Profile
									</div>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<div
										className={classNames(
											active ? ' text-[#E63E6D]' : 'text-white',
											'block px-4 py-2 text-sm cursor-pointer'
										)}
										onClick={() => router.push(`/profile/${userId}/edit`)}
									>
										Edit Profile
									</div>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<div
										className={classNames(
											active ? ' text-[#E63E6D]' : 'text-white',
											'block px-4 py-2 text-sm cursor-pointer'
										)}
										// @ts-ignore
										onClick={signOut}
									>
										Sign Out
									</div>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};

export default NavbarDropdown;
