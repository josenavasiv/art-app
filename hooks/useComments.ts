import useSWR, { useSWRConfig } from 'swr';

// Gets the comments of a specified artwork via the artwork's id
const useComments = (artworkId: string) => {
	const { mutate } = useSWRConfig();
	const key = `/api/artwork/${artworkId}/comments`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch(`/api/artwork/${artworkId}/comments`);
		const data = await response.json();
		return data;
	});
	// console.log('comments');
	// console.log(data);

	return {
		comments: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
		mutate_key: key,
	};
};

export default useComments;

// Returns an array of comment objects
// {
// 	artworkId: "cl253p0vc0107jktsx8im7hu6"
// 	authorId: "cl253ie2g0008jktshzr9lvwv"
// 	content: "Test Comment"
// 	createdAt: "2022-04-18T19:29:42.661Z"
// 	id: "cl2542mmd0371zktslpoagl84"
// }
