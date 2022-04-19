import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useUser = (id: string) => {
	const { data, error } = useSWR(`/api/user/${id}`, async () => {
		const response = await fetch(`/api/user/${id}`);
		const data = await response.json();
		return data;
	});

	return {
		user: data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useUser;

// Returns
// {
// 	backgroundImageUrl: null
// 	email: "josenavasiv@gmail.com"
// 	emailVerified: null
// 	id: "cl253ie2g0008jktshzr9lvwv"
// 	image: "https://lh3.googleusercontent.com/a-/AOh14Gie1FfPrtEntm3crauVn9N3nfAS3eQFj4QP40xiwQ=s96-c"
// 	name: "Jose Navas"
// 	status: null
// }
