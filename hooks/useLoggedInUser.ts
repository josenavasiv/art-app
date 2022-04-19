import useSWR from 'swr';

// Gets the user details of a specified user via the user's id
const useLoggedInUser = () => {
	const { data, error } = useSWR('/api/user', async () => {
		const response = await fetch('/api/user');
		const data = await response.json();
		return data;
	});

	return {
		loggedInUser: data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useLoggedInUser;

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
