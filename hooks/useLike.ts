import useSWR, { useSWRConfig } from 'swr';

// Gets the user details of a specified user via the user's id
const useLike = (artworkId: string) => {
	const { mutate } = useSWRConfig();
	const key = `/api/artwork/${artworkId}/like`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch(`/api/artwork/${artworkId}/like`, { method: 'GET' });
		const data = await response.json();
		return data;
	});

	return {
		liked: data,
		likeIsLoading: !error && !data,
		likeIsError: error,
		mutateLike: mutate,
		likeKey: key,
	};
};

export default useLike;
