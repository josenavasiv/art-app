import React from 'react';
import { ClientSafeProvider, getProviders, LiteralUnion } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async () => {
	const providers = await getProviders();
	return {
		props: { providers },
	};
};

const login: React.FC<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>> = ({ providers }) => {
	return (
		<>
			<Head>
				<title>Login</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className="flex flex-col items-center min-h-screen w-full justify-center relative">
				<div className="h-12 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">The Art Of Us</h1>
					<h1 className="text-3xl font-bold text-[#b7094c] p-3 absolute ml-[5px] mt-[5px]">The Art Of Us</h1>
				</div>
				{Object.values(providers).map((provider) => (
					<div className="mt-2" key={provider.name}>
						<div className="relative">
							<div
								className="w-full border-[#E9D8A6] text-[#E9D8A6] border-2 p-2 md:p-3 rounded-sm font-semibold text-sm md:text-lg cursor-pointer"
								onClick={() => signIn(provider.id, { callbackUrl: '/community' })}
							>
								Login with {provider.name}
							</div>
							<div
								className="w-full absolute top-0 ml-[2px] mt-[2px] -z-10 border-[#403DE3] text-[#403DE3] border-2 p-2 md:p-3 rounded-sm font-semibold text-sm md:text-lg"
								onClick={() => signIn(provider.id, { callbackUrl: '/community' })}
							>
								Login with {provider.name}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default login;
