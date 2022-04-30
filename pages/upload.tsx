import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Head from 'next/head';

import imageCompression from 'browser-image-compression';

// react-image-crop related imports
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from '../lib/canvasPreview';
import { useDebounceEffect } from '../lib/useDebounceEffect';
import 'react-image-crop/dist/ReactCrop.css';
import dataUrlToFile from '../lib/dataUrlToFile';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 50,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
}

export enum SectionEnum {
	community = 'Community',
	feedback = 'Feedback',
	resources = 'Resources',
}

interface IFormInput {
	title: string;
	description: string;
	tags: string[];
	file: File;
	section: SectionEnum;
}

const upload: React.FC = () => {
	const router = useRouter();
	const { loggedInUser } = useLoggedInUser();

	// react-crop-image
	const [imgSrc, setImgSrc] = useState('');
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [thumbnail, setThumbnail] = useState(null); // Thumbnail state

	const { register, handleSubmit, formState } = useForm<IFormInput>();

	// Add compression to both images here
	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		const artworkFile = data.file[0];
		const options = {
			maxWidthOrHeight: 1024,
			useWebWorker: true,
		};

		const compressedArtworkBlob = await imageCompression(artworkFile, options);
		const compressedArtworkFile = new File([compressedArtworkBlob], `${data.title.split(' ')[0]}.png`, {
			type: 'image/png',
		});
		const formData = new FormData();
		formData.append('file', compressedArtworkFile);

		const res = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
			method: 'POST',
			body: formData,
		});
		const resJson = await res.json();
		console.log(resJson);

		// // The Data is an object of the registered input elements
		// // Will pass data to a function that calls the internal API that prisma creates and also uploads image to cloudinary

		const optionsThumbnail = {
			maxWidthOrHeight: 512,
			useWebWorker: true,
		};

		const thumbnailFile = await dataUrlToFile(thumbnail, `${data.title.split(' ')[0]}_thumbnail.png`); // To get the first title word
		const compressedThumbnailBlob = await imageCompression(thumbnailFile, optionsThumbnail);
		const compressedThumbnailFile = new File(
			[compressedThumbnailBlob],
			`${data.title.split(' ')[0]}_thumbnail.png`,
			{
				type: 'image/png',
			}
		);

		const formDataThumbnail = new FormData();

		formDataThumbnail.append('file', compressedThumbnailFile);
		const thumbnailRes = await fetch(`/api/digitaloceans3?userid=${loggedInUser.id}`, {
			method: 'POST',
			body: formDataThumbnail,
		});
		const formDataThumbnailJson = await thumbnailRes.json();
		console.log(formDataThumbnailJson);

		const image_url: string = resJson.do_url;
		const thumbnail_url: string = formDataThumbnailJson.do_url;
		const title = data.title;
		const description = data.description;
		const section = data.section;
		// @ts-ignore
		const tags = data.tags.split(' ');
		const lowerCaseTags = tags.map((tag: string) => tag.toLowerCase());
		console.log(lowerCaseTags);
		const filteredTags = lowerCaseTags.filter((element: string) => element !== '');
		// @ts-ignore
		const mature = data.mature;
		const body = { title, description, section, image_url, thumbnail_url, mature, filteredTags };
		// Calls internal API to create prisma
		const result = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const artwork_data = await result.json();
		// Redirects to new upload id
		return router.push(`/artwork/${artwork_data.id}`);
	};

	const scale = 1;
	const rotate = 0;
	const aspect = 1;

	function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			// @ts-ignore
			reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
			reader.readAsDataURL(e.target.files[0]);
		} else {
			setImgSrc(null);
			setCompletedCrop(null);
		}
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		if (aspect) {
			const { width, height } = e.currentTarget;
			setCrop(centerAspectCrop(width, height, aspect));
		}
	}

	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
				const imageDataUrl = previewCanvasRef.current.toDataURL();
				// @ts-ignore
				setThumbnail(imageDataUrl);
			}
		},
		100,
		[completedCrop, scale, rotate]
	);

	if (!loggedInUser) {
		return (
			<>
				<Head>
					<title>Upload New Artwork</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				</Head>
				<Navbar />
				<div className="h-24 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">
						Please Sign In To Upload New Artwork.
					</h1>
					<h1 className="text-3xl font-bold text-[#403DE3] p-3 absolute ml-[5px] mt-[5px]">
						Please Sign In To Upload New Artwork.
					</h1>
				</div>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Upload New Artwork</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center space-y-3 mb-6">
				<div className="h-24 flex flex-col justify-center items-center p-4 relative">
					<h1 className="text-3xl font-bold text-[#E9D8A6] p-3 z-10 ">Upload New Artwork.</h1>
					<h1 className="text-3xl font-bold text-[#403DE3] p-3 absolute ml-[5px] mt-[5px]">
						Upload New Artwork.
					</h1>
				</div>
				<div className="w-3/4 md:w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
						<div className="space-y-1">
							<label htmlFor="title" className="text-sm font-medium text-gray-300 ">
								Title
							</label>
							<input
								id="title"
								{...register('title', { required: true, maxLength: 100 })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
							{formState.errors.title && (
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
									<p>A title is required and cannot exceed 100 characters</p>
								</div>
							)}
						</div>

						<div className="space-y-1">
							<label htmlFor="description" className="text-sm font-medium text-gray-300 ">
								Description
							</label>
							<textarea
								id="description"
								{...register('description', { required: true, maxLength: 2000 })}
								placeholder="Add a description for your art. Include links to resources you used or what inspired you"
								className="bg-gray-50 border font-medium border-gray-300 text-gray-900 h-48 whitespace-pre-line text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
							{formState.errors.description && (
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
									<p>A description is required and cannot exceed 2000 characters</p>
								</div>
							)}
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Artwork</label>
							{Boolean(imgSrc) && (
								<ReactCrop
									crop={crop}
									onChange={(_, percentCrop) => setCrop(percentCrop)}
									onComplete={(c) => setCompletedCrop(c)}
									aspect={aspect}
								>
									<img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
								</ReactCrop>
							)}
							<div>
								{Boolean(completedCrop) && (
									<>
										<label className="text-sm font-medium text-gray-300">Thumbnail</label>
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
								{...register('file', { required: true })}
								type="file"
								accept="image/*"
								onChange={onSelectFile}
								className="font-semibold text-sm file:mr-4 file:mt-2 file:py-1 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-[#e80059] file:text-white
							 file:cursor-pointer"
							/>
							{formState.errors.file && (
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
									<p>An image is required</p>
								</div>
							)}
						</div>

						<div className="flex flex-col space-y-1">
							<label htmlFor="section" className="text-sm font-medium text-gray-300 ">
								Section
							</label>
							<select
								id="section"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								{...register('section')}
							>
								<option value="COMMUNITY">Community</option>
								<option value="FEEDBACK">Feedback</option>
								<option value="RESOURCES">Resources</option>
							</select>
						</div>

						<div className="space-y-1">
							<label htmlFor="tags" className="text-sm font-medium text-gray-300 ">
								Tags
							</label>
							<input
								id="tags"
								{...register('tags')}
								placeholder="Seperate with spaces - Digital Traditional Horror Anime 2D 3D ..."
								className="bg-gray-50 border font-medium border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									// @ts-ignore
									{...register('mature')}
									id="mature"
									type="checkbox"
									className="w-4 h-4 cursor-pointer bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="mature" className="font-medium text-gray-900 dark:text-gray-300">
									Contains Mature Content
								</label>
							</div>
						</div>

						{/* Submit Loader Spinner */}
						{formState.isSubmitting && (
							<div className="font-medium bg-[#e80059] text-[#F2E9E4] rounded-full flex flex-row justify-center items-center space-x-1">
								<div className="text-sm md:text-lg">Uploading artwork! Please wait!</div>
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
							className="p-3 w-15 rounded-md bg-[#e80059] cursor-pointer font-semibold"
							type="submit"
							value="Submit"
						/>
					</form>
				</div>
			</div>
		</>
	);
};

export default upload;

// Use react hook forms
// Use Amazon Rekognition for violence and disturbing images etc

// export interface IUpload {
// 	id: string;
// 	title: string;
//  description: string;
// 	createAt: string;
// 	imageUrl: string;
// 	thumbnailUrl: string;
// 	tags: string[];
// 	viewCount: number;
// 	likeCount: number;
// 	mature: boolean;
// 	section: string;
// 	subjects: string[]; (Would be checkboxes)
// 	uploadedBy: string;
// 	uploadedByImageUrl?: string;
// 	authorId: string;
// }

// formData.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset

// // Need to add Error Handling
// const res = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
// 	method: 'POST',
// 	body: formData,
// });
