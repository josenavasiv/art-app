import useSWR, { useSWRConfig } from 'swr';

// Gets the user details of a specified user via the user's id
const useUserArtworks = (userId: string) => {
	const { mutate } = useSWRConfig();
	const key = `/api/user/${userId}/artworks`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch(`/api/user/${userId}/artworks`);
		const data = await response.json();
		return data;
	});

	console.log(data);

	return {
		userArtworks: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
		key: key,
	};
};

export default useUserArtworks;
