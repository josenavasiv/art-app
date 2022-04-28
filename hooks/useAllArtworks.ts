import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useAllArtworks = () => {
	const { data, error } = useSWR(`/api/artworks`, async () => {
		const response = await fetch(`/api/artworks`);
		const data = await response.json();
		return data;
	});

	return {
		allArtworks: data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useAllArtworks;
