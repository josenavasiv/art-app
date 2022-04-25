import { ChangeEventHandler, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';

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
	const { data: session, status } = useSession();
	const { register, handleSubmit, formState } = useForm<IFormInput>();

	const [uploadedImage, setUploadedImage] = useState('');

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		// The Data is an object of the registered input elements
		// Will pass data to a function that calls the internal API that prisma creates and also uploads image to cloudinary
		const formData = new FormData();
		// @ts-ignore
		formData.append('file', data.file[0]);
		formData.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset

		// Need to add Error Handling
		const res = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
			method: 'POST',
			body: formData,
		});
		const resJson = await res.json();
		const image_url: string = resJson.secure_url;
		const title = data.title;
		const description = data.description;
		const section = data.section;
		// @ts-ignore
		const tags = data.tags.split(' ');
		const filteredTags = tags.filter((element: string) => element !== '');
		// @ts-ignore
		const mature = data.mature;
		const body = { title, description, section, image_url, mature, filteredTags };
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

	const handlePreview: ChangeEventHandler<HTMLInputElement> = (e) => {
		// @ts-ignore
		if (e.target.files.length !== 0) {
			// @ts-ignore
			setUploadedImage(URL?.createObjectURL(e.target.files[0]));
		} else {
			setUploadedImage('');
		}
	};

	if (!session) {
		return (
			<>
				<Navbar />
				<div className="w-full h-full flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold underline text-[#E63E6D]">Please Log In to Upload Image</h1>
					<button onClick={() => signIn()} className="bg-white p-2">
						SIGN IN
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center space-y-3 mb-6">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#E63E6D] p-3 ">Upload New Artwork.</h1>
				</div>
				<div className="w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
						<div className="space-y-1">
							<label htmlFor="title" className="text-sm font-medium text-gray-300 ">
								Title
							</label>
							<input
								id="title"
								{...register('title', { required: true })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="space-y-1">
							<label htmlFor="description" className="text-sm font-medium text-gray-300 ">
								Description
							</label>
							<textarea
								id="description"
								{...register('description', { required: true, maxLength: 1000 })}
								placeholder="Add a description for your art. Include links to resources you used or what inspired you"
								className="bg-gray-50 border font-medium border-gray-300 text-gray-900 h-48 whitespace-pre-line text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Artwork</label>
							<img src={uploadedImage} />

							<input
								{...register('file', { required: true })}
								type="file"
								accept="image/*"
								onChange={handlePreview}
								className="font-semibold text-sm file:mr-4 file:mt-2 file:py-1 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-[#E63E6D] file:text-white
							 file:cursor-pointer"
							/>
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
									className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="mature" className="font-medium text-gray-900 dark:text-gray-300">
									Contains Mature Content
								</label>
							</div>
						</div>

						{/* Submit Loader Spinner */}
						{formState.isSubmitting && <div className="bg-red-200 text-white mt-10">SUBMITTING!</div>}

						<input
							disabled={formState.isSubmitting}
							className="p-3 w-15 rounded-md bg-[#E63E6D] cursor-pointer"
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
