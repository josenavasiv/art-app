import useSWR, { useSWRConfig } from 'swr';

// Gets the comments of a specified artwork via the artwork's id
const useIsFollowing = (userId: string) => {
	const { mutate } = useSWRConfig();
	const key = `/api/user/${userId}/follow`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch(`/api/user/${userId}/follow`, { method: 'GET' });
		const data = await response.json();
		return data;
	});
	console.log('FOLLOWING DATA');
	console.log(data);

	return {
		following: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
		mutate_key: key,
	};
};

export default useIsFollowing;
