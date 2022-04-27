import { ChangeEventHandler, useState } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useLoggedInUser from '../../../../hooks/useLoggedInUser';
import prisma from '../../../../lib/prisma';

import Navbar from '../../../../components/Navbar';
import Head from 'next/head';

// Will protect with middleware
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	// @ts-ignore
	const userId = context.query.id;

	// Can force redirect here if user is not logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	} else {
		const data = await prisma.user.findUnique({
			where: {
				// @ts-ignore
				id: userId,
			},
		});
		const userDetails = JSON.parse(JSON.stringify(data));
		// console.log(userDetails);
		return {
			props: {
				userDetails,
			},
		};
	}
};

interface IUpdateProfile {
	displayName: string;
	headline: string;
	showMatureContent: boolean;
	avatar: string;
	backgroundImageUrl: string;
	bio: string;
}

const index: React.FC = ({ userDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { loggedInUser } = useLoggedInUser();

	const [avatarPreview, setAvatarPreview] = useState(userDetails.avatar ?? userDetails.image);
	const [backgroundPreview, setBackgroundPreview] = useState(userDetails.backgroundImageUrl);

	const { register, handleSubmit, formState, setValue } = useForm<IUpdateProfile>();

	// Setting the input fields of the original artwork
	setValue('displayName', userDetails.displayName ?? userDetails.name);
	setValue('headline', userDetails.headline);
	setValue('bio', userDetails.bio);
	setValue('showMatureContent', userDetails.showMatureContent);

	const onSubmit: SubmitHandler<IUpdateProfile> = async (data) => {
		const displayName = data.displayName;
		const headline = data.headline;
		const showMatureContent = data.showMatureContent;
		const bio = data.bio;
		// console.log(bio);

		let body = { displayName, headline, showMatureContent, bio };

		if (Array.from(data.avatar).length > 0 && Array.from(data.backgroundImageUrl).length > 0) {
			const formDataAvatar = new FormData();
			const formDataBackground = new FormData();
			formDataAvatar.append('file', data.avatar[0]);
			formDataBackground.append('file', data.backgroundImageUrl[0]);

			const avatarRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
				method: 'POST',
				body: formDataAvatar,
			});
			const avatarJson = await avatarRes.json();
			const avatar: string = avatarJson.do_url;

			const backgroundRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
				method: 'POST',
				body: formDataBackground,
			});
			const backgroundJson = await backgroundRes.json();
			const backgroundImageUrl: string = backgroundJson.do_url;

			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl, bio };
		} else if (Array.from(data.avatar).length > 0 && Array.from(data.backgroundImageUrl).length === 0) {
			// console.log('avatar');
			const formDataAvatar = new FormData();
			formDataAvatar.append('file', data.avatar[0]);
			const avatarRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
				method: 'POST',
				body: formDataAvatar,
			});
			const avatarJson = await avatarRes.json();
			const avatar: string = avatarJson.do_url;

			const backgroundImageUrl = userDetails.backgroundImageUrl;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
		} else if (Array.from(data.avatar).length === 0 && Array.from(data.backgroundImageUrl).length > 0) {
			// console.log('background');
			const formDataBackground = new FormData();
			formDataBackground.append('file', data.backgroundImageUrl[0]);
			const backgroundRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
				method: 'POST',
				body: formDataBackground,
			});
			const backgroundJson = await backgroundRes.json();
			const backgroundImageUrl: string = backgroundJson.do_url;
			const avatar = userDetails.avatar;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl, bio };
		} else {
			const avatar = userDetails.avatar;
			const backgroundImageUrl = userDetails.backgroundImageUrl;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl, bio };
		}

		const result = await fetch(`/api/user/${userDetails.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const userData = await result.json();
		return router.push(`/profile/${userData.id}`);
	};

	const handleAvatarPreview: ChangeEventHandler<HTMLInputElement> = (e) => {
		// @ts-ignore

		if (e.target.files.length !== 0) {
			// @ts-ignore
			setAvatarPreview(URL.createObjectURL(e.target.files[0]));
		}
	};

	const handleBackgroundPreview: ChangeEventHandler<HTMLInputElement> = (e) => {
		// @ts-ignore
		if (e.target.files.length !== 0) {
			// @ts-ignore
			setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
		}
	};

	return (
		<>
			<Head>
				<title>Edit Profile - {userDetails.displayName ?? userDetails.name}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center mb-6">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Edit Profile.</h1>
				</div>
				<div className="w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
						<div className="space-y-1">
							<label htmlFor="displayName" className="text-sm font-medium text-gray-300 ">
								Display Name
							</label>
							<input
								id="displayName"
								{...register('displayName', { required: true })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="space-y-1">
							<label htmlFor="headline" className="text-sm font-medium text-gray-300 ">
								Headline - Describe a goal or what you currently do!
							</label>
							<input
								id="headline"
								{...register('headline', { required: true, maxLength: 60 })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="space-y-1">
							<label htmlFor="bio" className="text-sm font-medium text-gray-300 ">
								Bio
							</label>
							<textarea
								id="bio"
								{...register('bio', { required: true, maxLength: 1000 })}
								placeholder="Add a bio to your profile. Add links to your socials as well."
								className="bg-gray-50 border font-medium border-gray-300 text-gray-900 h-48 whitespace-pre-line text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Avatar</label>
							<img src={avatarPreview} />
							<input
								{...register('avatar')}
								type="file"
								accept="image/*"
								onChange={handleAvatarPreview}
								className="font-semibold text-sm file:mr-4 file:mt-2 file:py-1 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-[#e80059] file:text-white"
							/>
						</div>
						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Background (16:9 Ratio Ideal)</label>
							<img src={backgroundPreview} />
							<input
								{...register('backgroundImageUrl')}
								type="file"
								accept="image/*"
								onChange={handleBackgroundPreview}
								className="font-semibold text-sm file:mr-4 file:mt-2 file:py-1 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-[#e80059] file:text-white"
							/>
						</div>

						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									// @ts-ignore
									{...register('showMatureContent')}
									id="showMatureContent"
									type="checkbox"
									className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label
									htmlFor="showMatureContent"
									className="font-medium text-gray-900 dark:text-gray-300"
								>
									Show Mature Content?
								</label>
							</div>
						</div>

						{/* Submit Loader Spinner */}
						{formState.isSubmitting && (
							<div className="font-medium bg-[#e80059] text-[#F2E9E4] rounded-full flex flex-row justify-center items-center space-x-1">
								<div>Uploading artwork! Please wait!</div>
								<svg
									width="20px"
									height="20px"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="animate-spin "
								>
									<path
										d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z"
										fill="white"
									/>
									<path
										d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
										fill="white"
									/>
								</svg>
							</div>
						)}

						<input
							disabled={formState.isSubmitting}
							className="p-3 w-15 rounded-md font-semibold bg-[#e80059]"
							type="submit"
							value="Submit"
						/>
					</form>
				</div>
			</div>
		</>
	);
};

export default index;
