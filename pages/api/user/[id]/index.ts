import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// GET & PUT /api/user/[id]
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const bodyData = req.body;
	console.log(bodyData);

	const displayName = bodyData.displayName;
	const headline = bodyData.headline;
	const showMatureContent = bodyData.showMatureContent;
	const avatar = bodyData?.avatar;
	const backgroundImageUrl = bodyData?.backgroundImageUrl;
	const bio = bodyData?.bio;

	if (req.method === 'GET') {
		const result = await prisma.user.findUnique({
			// @ts-ignore
			where: { id: id },
		});

		res.json(result);
	} else if (req.method === 'PUT') {
		const session = await getSession({ req });

		const result = await prisma.user.findUnique({
			// @ts-ignore
			where: { id: id },
		});

		if (session?.user?.email === result?.email) {
			const updatedUser = await prisma.user.update({
				// @ts-ignore
				where: { id: result?.id },
				data: {
					displayName: displayName,
					headline: headline,
					showMatureContent: showMatureContent,
					avatar: avatar,
					backgroundImageUrl: backgroundImageUrl,
					// @ts-ignore
					bio: bio,
				},
			});
			res.json(updatedUser);
		} else {
			res.status(401).send({ message: 'Unauthorized. Please sign in' });
		}
	}
}

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
