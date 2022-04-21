import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useFollowArtworks = (userId: string) => {
	const key = `/api/user/${userId}/artworks?limit=3`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch(`/api/user/${userId}/artworks?limit=3`);
		const data = await response.json();
		return data;
	});

	return {
		followArtworks: data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useFollowArtworks;
