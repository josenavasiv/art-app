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
			<div className="flex flex-col items-center min-h-screen w-full justify-center">
				<h1 className="text-[#FFDADA] font-bold text-2xl md:text-5xl">Arstation Pinterest App</h1>
				{Object.values(providers).map((provider) => (
					<div className="mt-5" key={provider.name}>
						<button
							className=" border-[#DB6B97] text-[#DB6B97] border-2 p-2 md:p-3 rounded-full font-semibold text-sm md:text-lg"
							onClick={() => signIn(provider.id, { callbackUrl: '/community' })}
						>
							Login with {provider.name}
						</button>
					</div>
				))}
			</div>
		</>
	);
};

export default login;
