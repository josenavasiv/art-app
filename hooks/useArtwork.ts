import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useArtwork = (artworkId: string) => {
	const { data, error } = useSWR(`/api/artwork/${artworkId}`, async () => {
		const response = await fetch(`/api/artwork/${artworkId}`, { method: 'GET' });
		const data = await response.json();
		return data;
	});

	return {
		artworkDetails: data,
		artworkIsLoading: !error && !data,
		artworkIsError: error,
	};
};

export default useArtwork;
