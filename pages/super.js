import { ChangeEventHandler, useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import useLoggedInUser from '../hooks/useLoggedInUser';
import Head from 'next/head';

const test = () => {
	const { register, handleSubmit, formState } = useForm();

	const [uploadedImage, setUploadedImage] = useState('');

	const onSubmit = async (data) => {
		const formData = new FormData();
		// @ts-ignore
		formData.append('file', data.file[0]);
		const res = await fetch('/api/digitaloceans3', {
			method: 'POST',
			body: formData,
		});
		const do_url = await res.json();
		console.log(do_url);
		return;
	};

	const handlePreview = (e) => {
		// @ts-ignore
		if (e.target.files.length !== 0) {
			// @ts-ignore
			setUploadedImage(URL?.createObjectURL(e.target.files[0]));
		} else {
			setUploadedImage('');
		}
	};

	return (
		<>
			<Head>
				<title>TEST</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center space-y-3 mb-6">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#e80059] p-3 ">Upload New Artwork.</h1>
				</div>
				<div className="w-full max-w-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col text-gray-300 ">
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
								file:bg-[#e80059] file:text-white
							 file:cursor-pointer"
							/>
						</div>
						<input
							disabled={formState.isSubmitting}
							className="p-3 w-15 rounded-md bg-[#e80059] cursor-pointer font-semibold"
							type="submit"
							value="Submit"
						/>
						<img src="https://app-artworks.sfo3.digitaloceanspaces.com/angel.jpg" alt="" />
					</form>
				</div>
			</div>
		</>
	);
};

export default test;
