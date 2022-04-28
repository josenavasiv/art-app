import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useLike = (artworkId: string) => {
	const { data, error } = useSWR(`/api/artwork/${artworkId}/like`, async () => {
		const response = await fetch(`/api/artwork/${artworkId}/like`, { method: 'GET' });
		const data = await response.json();
		return data;
	});

	return {
		liked: data,
		likeIsLoading: !error && !data,
		likeIsError: error,
	};
};

export default useLike;
