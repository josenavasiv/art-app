import useSWR, { useSWRConfig } from 'swr';

// Gets the user details of a specified user via the user's id
const useLoggedInUser = () => {
	const { mutate } = useSWRConfig();
	const key = `/api/user`;
	const { data, error } = useSWR(key, async () => {
		const response = await fetch('/api/user');
		const data = await response.json();
		return data;
	});

	return {
		loggedInUser: data,
		mutateLoggedInUser: mutate,
		loggedInUserKey: key,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useLoggedInUser;

// Returns
// {
// avatar: "https://res.cloudinary.com/josenavasiv/image/upload/v1650564660/uploads/iv69h25zqqvqrubxmcmv.jpg"
// backgroundImageUrl: "https://res.cloudinary.com/josenavasiv/image/upload/v1650437675/uploads/cpseztsmaomuagclnjvf.jpg"
// displayName: "JoJoJacKy"
// email: "josenavasiv@gmail.com"
// emailVerified: null
// headline: "Aspiring Artist"
// id: "cl26usi0500118gtsxch0n2ob"
// image: "https://lh3.googleusercontent.com/a-/AOh14Gie1FfPrtEntm3crauVn9N3nfAS3eQFj4QP40xiwQ=s96-c"
// name: "Jose Navas"
// showMatureContent: true
// }
