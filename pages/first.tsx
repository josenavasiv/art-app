import { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useLoggedInUser from '../hooks/useLoggedInUser';
import prisma from '../lib/prisma';

import Navbar from '../components/Navbar';
import Head from 'next/head';

// react-image-crop related imports
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from '../lib/canvasPreview';
import { useDebounceEffect } from '../lib/useDebounceEffect';
import 'react-image-crop/dist/ReactCrop.css';
import dataUrlToFile from '../lib/dataUrlToFile';
import imageCompression from 'browser-image-compression';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 40,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
}

// Will protect with middleware
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	// @ts-ignore

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
				email: session?.user?.email,
			},
		});
		const userDetails = JSON.parse(JSON.stringify(data));
		console.log(userDetails);
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

const first: React.FC = ({ userDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { loggedInUser } = useLoggedInUser();

	const { register, handleSubmit, formState, setValue } = useForm<IUpdateProfile>();

	// react-crop-image
	const [avatarSrc, setAvatarSrc] = useState(null);
	const [avatar, setAvatar] = useState(null); // Avatar
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

	const [backgroundSrc, setBackgroundSrc] = useState(null);
	const [background, setBackground] = useState(null); // Background
	const previewCanvasRefBackground = useRef<HTMLCanvasElement>(null);
	const imgRefBackground = useRef<HTMLImageElement>(null);
	const [cropBackground, setCropBackground] = useState<Crop>();
	const [completedCropBackground, setCompletedCropBackground] = useState<PixelCrop>();

	const scale = 1;
	const rotate = 0;
	// aspect
	const aspectAvatar = 1;
	const aspectBackground = 16 / 9;

	function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			// @ts-ignore
			reader.addEventListener('load', () => setAvatarSrc(reader.result.toString() || ''));
			reader.readAsDataURL(e.target.files[0]);
		} else {
			setAvatarSrc(null);
			setCompletedCrop(null);
		}
	}
	function onSelectFileBackground(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setCropBackground(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			// @ts-ignore
			reader.addEventListener('load', () => setBackgroundSrc(reader.result.toString() || ''));
			reader.readAsDataURL(e.target.files[0]);
		} else {
			setBackgroundSrc(null);
			setCompletedCropBackground(null);
		}
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		if (aspectAvatar) {
			const { width, height } = e.currentTarget;
			setCrop(centerAspectCrop(width, height, aspectAvatar));
		}
		if (aspectBackground) {
			const { width, height } = e.currentTarget;
			setCropBackground(centerAspectCrop(width, height, aspectBackground));
		}
	}

	useDebounceEffect(
		async () => {
			if (
				completedCropBackground?.width &&
				completedCropBackground?.height &&
				imgRefBackground.current &&
				previewCanvasRefBackground.current
			) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(
					imgRefBackground.current,
					previewCanvasRefBackground.current,
					completedCropBackground,
					scale,
					rotate
				);
				const imageDataUrlBackground = previewCanvasRefBackground.current.toDataURL();
				// @ts-ignore
				setBackground(imageDataUrlBackground);
			}
		},
		100,
		[completedCropBackground, scale, rotate]
	);
	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
				const imageDataUrl = previewCanvasRef.current.toDataURL();
				// @ts-ignore
				setAvatar(imageDataUrl);
			}
		},
		100,
		[completedCrop, scale, rotate]
	);

	// End React-Image-Crop

	useEffect(() => {
		// Setting the input fields of the original artwork
		setValue('displayName', userDetails.displayName ?? userDetails.name);
		setValue('headline', userDetails.headline);
		setValue('bio', userDetails.bio);
		setValue('showMatureContent', userDetails.showMatureContent);
	}, []);

	const onSubmit: SubmitHandler<IUpdateProfile> = async (data) => {
		const displayName = data.displayName;
		const headline = data.headline;
		const showMatureContent = data.showMatureContent;
		const bio = data.bio;

		let body = { displayName, headline, showMatureContent, bio };

		const optionsAvatar = {
			maxWidthOrHeight: 128,
			useWebWorker: true,
		};
		const optionsBackground = {
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};

		var avatarVar = avatar ?? [];
		var backgroundVar = background ?? [];

		if (Array.from(avatarVar).length > 0 && Array.from(backgroundVar).length > 0) {
			const avatarFile = await dataUrlToFile(avatarVar, `${data.displayName.split(' ')[0]}_avatar.png`); // To get the first title word
			const backgroundFile = await dataUrlToFile(
				backgroundVar,
				`${data.displayName.split(' ')[0]}_background.png`
			); // To get the first title word
			const compressedAvatarBlob = await imageCompression(avatarFile, optionsAvatar);
			const compressedAvatarFile = new File(
				[compressedAvatarBlob],
				`${data.displayName.split(' ')[0]}_avatar.png`,
				{
					type: 'image/png',
				}
			);

			const formDataAvatar = new FormData();
			formDataAvatar.append('file', compressedAvatarFile);

			const compressedBackgroundBlob = await imageCompression(backgroundFile, optionsBackground);
			const compressedBackgroundFile = new File(
				[compressedBackgroundBlob],
				`${data.displayName.split(' ')[0]}_background.png`,
				{
					type: 'image/png',
				}
			);

			const formDataBackground = new FormData();
			formDataBackground.append('file', compressedBackgroundFile);

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
		} else if (Array.from(avatarVar).length > 0 && Array.from(backgroundVar).length === 0) {
			const avatarFile = await dataUrlToFile(avatarVar, `${data.displayName.split(' ')[0]}_avatar.png`); // To get the first title word

			const compressedAvatarBlob = await imageCompression(avatarFile, optionsAvatar);
			const compressedAvatarFile = new File(
				[compressedAvatarBlob],
				`${data.displayName.split(' ')[0]}_avatar.png`,
				{
					type: 'image/png',
				}
			);

			const formDataAvatar = new FormData();
			formDataAvatar.append('file', compressedAvatarFile);

			const avatarRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
				method: 'POST',
				body: formDataAvatar,
			});
			const avatarJson = await avatarRes.json();
			const avatar: string = avatarJson.do_url;

			const backgroundImageUrl = userDetails.backgroundImageUrl;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
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

	return (
		<>
			<Head>
				<title>Create Profile - {userDetails.displayName ?? userDetails.name}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center mb-6">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Create Profile</h1>
				</div>
				<div className="w-3/4 md:w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
						<div className="space-y-1">
							<label htmlFor="displayName" className="text-sm font-medium text-gray-300 ">
								Display Name
							</label>
							<input
								id="displayName"
								{...register('displayName', {
									required: true,
									maxLength: 100,
								})}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
							{formState.errors.displayName && (
								<div className="error-msg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									<p>Display Name is required and cannot exceed 100 characters</p>
								</div>
							)}
						</div>

						<div className="space-y-1">
							<label htmlFor="headline" className="text-sm font-medium text-gray-300 ">
								Headline - Describe what you do or who you are in a sentence
							</label>
							<input
								id="headline"
								{...register('headline', { required: true, maxLength: 150 })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
							{formState.errors.headline && (
								<div className="error-msg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									<p>Headline is required and cannot exceed 150 characters</p>
								</div>
							)}
						</div>

						<div className="space-y-1">
							<label htmlFor="bio" className="text-sm font-medium text-gray-300 ">
								Biography
							</label>
							<textarea
								id="bio"
								{...register('bio', { maxLength: 2000 })}
								placeholder="Add a bio to your profile. Add links to your socials as well."
								className="bg-gray-50 border font-medium border-gray-300 text-gray-900 h-48 whitespace-pre-line text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Crop Avatar</label>

							{Boolean(avatarSrc) && (
								<ReactCrop
									crop={crop}
									onChange={(_, percentCrop) => setCrop(percentCrop)}
									onComplete={(c) => setCompletedCrop(c)}
									aspect={aspectAvatar}
								>
									<img ref={imgRef} alt="Crop me" src={avatarSrc} onLoad={onImageLoad} />
								</ReactCrop>
							)}
							<div>
								{Boolean(completedCrop) && (
									<>
										<label className="text-sm font-medium text-gray-300">Avatar</label>
										<canvas
											ref={previewCanvasRef}
											style={{
												border: '1px solid black',
												objectFit: 'contain',
												// @ts-ignore
												width: completedCrop.width,
												// @ts-ignore
												height: completedCrop.height,
											}}
										/>
									</>
								)}
							</div>
							{/* @ts-ignore */}

							<input
								{...register('avatar', { required: true })}
								type="file"
								accept="image/*"
								onChange={onSelectFile}
								className="font-semibold text-sm file:mr-4 file:mt-2 file:py-1 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-[#e80059] file:text-white
							 file:cursor-pointer"
							/>
							{formState.errors.avatar && (
								<div className="error-msg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									<p>An Avatar is required</p>
								</div>
							)}
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Crop Background</label>
							{Boolean(backgroundSrc) && (
								<ReactCrop
									crop={cropBackground}
									onChange={(_, percentCrop) => setCropBackground(percentCrop)}
									onComplete={(c) => setCompletedCropBackground(c)}
									aspect={aspectBackground}
								>
									<img
										ref={imgRefBackground}
										alt="Crop me"
										src={backgroundSrc}
										onLoad={onImageLoad}
									/>
								</ReactCrop>
							)}
							<div>
								{Boolean(completedCropBackground) && (
									<>
										<label className="text-sm font-medium text-gray-300">Background</label>
										<canvas
											ref={previewCanvasRefBackground}
											style={{
												border: '1px solid black',
												objectFit: 'contain',
												// @ts-ignore
												width: completedCropBackground.width,
												// @ts-ignore
												height: completedCropBackground.height,
											}}
										/>
									</>
								)}
							</div>
							<input
								{...register('backgroundImageUrl')}
								type="file"
								accept="image/*"
								onChange={onSelectFileBackground}
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
									className="w-4 h-4 cursor-pointer bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
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
								<div className="text-sm md:text-lg">Creating Profile! Please wait!</div>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="animate-spin w-4 md:w-5"
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
							className="p-3 w-15 rounded-md font-semibold bg-[#e80059] cursor-pointer"
							type="submit"
							value="Submit"
						/>
					</form>
				</div>
			</div>
		</>
	);
};

export default first;

// This page loads to first time sign-in users
