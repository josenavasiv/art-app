import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import '../public/nprogress.css';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	// Code for the loader
	useEffect(() => {
		const handleStart = (url) => {
			console.log(`Loading: ${url}`);
			NProgress.start();
		};
		const handleStop = () => {
			NProgress.done();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleStop);
		router.events.on('routeChangeError', handleStop);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleStop);
			router.events.off('routeChangeError', handleStop);
		};
	}, [router]);
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}

export default MyApp;
