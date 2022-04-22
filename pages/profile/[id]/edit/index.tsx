import { ChangeEventHandler, useState } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Navbar from '../../../../components/Navbar';

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
}

const index: React.FC = ({ userDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();

	const [avatarPreview, setAvatarPreview] = useState(userDetails.avatar ?? userDetails.image);
	const [backgroundPreview, setBackgroundPreview] = useState(userDetails.backgroundImageUrl);

	const { register, handleSubmit, formState, setValue } = useForm<IUpdateProfile>();

	// Setting the input fields of the original artwork
	setValue('displayName', userDetails.displayName ?? userDetails.name);
	setValue('headline', userDetails.headline);
	setValue('showMatureContent', userDetails.showMatureContent);

	const onSubmit: SubmitHandler<IUpdateProfile> = async (data) => {
		const displayName = data.displayName;
		const headline = data.headline;
		const showMatureContent = data.showMatureContent;

		let body = { displayName, headline, showMatureContent };

		if (Array.from(data.avatar).length > 0 && Array.from(data.backgroundImageUrl).length > 0) {
			const formDataAvatar = new FormData();
			const formDataBackground = new FormData();
			formDataAvatar.append('file', data.avatar[0]);
			formDataBackground.append('file', data.backgroundImageUrl[0]);

			formDataAvatar.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset
			formDataBackground.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset

			const avatarRes = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
				method: 'POST',
				body: formDataAvatar,
			});
			const avatarJson = await avatarRes.json();
			const avatar: string = avatarJson.secure_url;

			const backgroundRes = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
				method: 'POST',
				body: formDataBackground,
			});
			const backgroundJson = await backgroundRes.json();
			const backgroundImageUrl: string = backgroundJson.secure_url;

			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
		} else if (Array.from(data.avatar).length > 0 && Array.from(data.backgroundImageUrl).length === 0) {
			console.log('avatar');
			const formDataAvatar = new FormData();
			formDataAvatar.append('file', data.avatar[0]);
			formDataAvatar.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset
			const avatarRes = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
				method: 'POST',
				body: formDataAvatar,
			});
			const avatarJson = await avatarRes.json();
			const avatar: string = avatarJson.secure_url;

			const backgroundImageUrl = userDetails.backgroundImageUrl;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
		} else if (Array.from(data.avatar).length === 0 && Array.from(data.backgroundImageUrl).length > 0) {
			console.log('background');
			const formDataBackground = new FormData();
			formDataBackground.append('file', data.backgroundImageUrl[0]);
			formDataBackground.append('upload_preset', 'uploads'); // For the Cloudinary Images Preset
			const backgroundRes = await fetch('https://api.cloudinary.com/v1_1/josenavasiv/image/upload', {
				method: 'POST',
				body: formDataBackground,
			});
			const backgroundJson = await backgroundRes.json();
			const backgroundImageUrl: string = backgroundJson.secure_url;
			const avatar = userDetails.avatar;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
		} else {
			const avatar = userDetails.avatar;
			const backgroundImageUrl = userDetails.backgroundImageUrl;
			// @ts-ignore
			body = { displayName, headline, showMatureContent, avatar, backgroundImageUrl };
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
		setAvatarPreview(URL.createObjectURL(e.target.files[0]));
	};

	const handleBackgroundPreview: ChangeEventHandler<HTMLInputElement> = (e) => {
		// @ts-ignore
		setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
	};

	return (
		<>
			<Navbar />
			<div className="w-full h-full flex flex-col justify-center items-center mb-6">
				<div className="h-36 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-[#E63E6D] p-3 ">Edit Profile.</h1>
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

						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Avatar</label>
							<img src={avatarPreview} />
							<input
								{...register('avatar')}
								type="file"
								accept="image/*"
								onChange={handleAvatarPreview}
								className="font-semibold text-sm"
							/>
						</div>
						<div className="flex flex-col space-y-1">
							<label className="text-sm font-medium text-gray-300">Background</label>
							<img src={backgroundPreview} />
							<input
								{...register('backgroundImageUrl')}
								type="file"
								accept="image/*"
								onChange={handleBackgroundPreview}
								className="font-semibold text-sm"
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
