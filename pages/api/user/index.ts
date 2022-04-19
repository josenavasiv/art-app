import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// GET /api/user
// Grabs the logged in user's details
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (session) {
		const result = await prisma.user.findUnique({
			// @ts-ignore
			where: { email: session?.user?.email },
		});

		res.json(result);
	} else {
		// When session DNE, the old session data for the useLoggedInUser Hook is replaced with null
		res.json(null);
	}
}

// Potentially change to getting the user's profile account details

// Results In
// {
// 	backgroundImageUrl: null
// 	email: "josenavasiv@gmail.com"
// 	emailVerified: null
// 	id: "cl253ie2g0008jktshzr9lvwv"
// 	image: "https://lh3.googleusercontent.com/a-/AOh14Gie1FfPrtEntm3crauVn9N3nfAS3eQFj4QP40xiwQ=s96-c"
// 	name: "Jose Navas"
// 	status: null
// }
