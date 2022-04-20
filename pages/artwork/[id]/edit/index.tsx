import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import prisma from '../../../../lib/prisma';
import { SectionEnum } from '../../../upload';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Navbar from '../../../../components/Navbar';

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	} else {
		// Maybe protect edit is unnecassary
		// const userData = await prisma.user.findUnique({
		// 	where: {
		// 		// @ts-ignore
		// 		email: session?.user?.email
		// 	}
		// })
		const artworkData = await prisma.artwork.findUnique({
			where: {
				// @ts-ignore
				id: context.query.id,
			},
		});
		const artworkDetails = JSON.parse(JSON.stringify(artworkData));
		console.log(artworkDetails);

		return {
			props: {
				artworkDetails,
			},
		};
	}
};

interface IUpdateArtwork {
	title: string;
	description: string;
	section: SectionEnum;
	mature: boolean;
}

const index: React.FC = ({ artworkDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { register, handleSubmit, formState, setValue } = useForm<IUpdateArtwork>();

	// Setting the input fields of the original artwork
	setValue('title', artworkDetails.title);
	setValue('description', artworkDetails.description);
	setValue('section', artworkDetails.section);
	setValue('mature', artworkDetails.mature);

	const onSubmit: SubmitHandler<IUpdateArtwork> = async (data) => {
		const title = data.title;
		const description = data.description;
		const section = data.section;
		const mature = data.mature;
		const body = { title, description, section, mature };

		const result = await fetch(`/api/artwork/${artworkDetails.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const artwork_data = await result.json();
		// Redirects to new updated artwork id
		return router.push(`/artwork/${artwork_data.id}`);
	};

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center space-y-3">
				<h1 className="text-3xl font-bold underline text-[#E63E6D] p-4">Edit Page</h1>
				<div className="w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
						<div className="space-y-1">
							<label htmlFor="title" className="text-sm font-medium text-gray-300 ">
								Title
							</label>
							<input
								id="title"
								{...register('title', { required: true })}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div className="space-y-1">
							<label htmlFor="description" className="text-sm font-medium text-gray-300 ">
								Description
							</label>
							<textarea
								id="description"
								{...register('description', { required: true, maxLength: 1000 })}
								className="bg-gray-50 border border-gray-300 text-gray-900 whitespace-pre-line text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full h-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						<div>
							<img src={artworkDetails.imageUrl} />
						</div>

						{/* <input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								placeholder="Tags (Seperate by Commas)"
							/> */}
						<div className="flex flex-col space-y-1">
							<label htmlFor="section" className="text-sm font-medium text-gray-300 ">
								Section
							</label>
							<select
								id="section"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								{...register('section')}
							>
								<option value="COMMUNITY">Community</option>
								<option value="FEEDBACK">Feedback</option>
								<option value="RESOURCES">Resources</option>
							</select>
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
							className="p-3 w-15 rounded-md bg-[#E63E6D]"
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

// Add the edit button to those whose authorId === userId via SSR
