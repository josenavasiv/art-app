import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const result = await prisma.user.findUnique({
		// @ts-ignore
		where: { id: id },
	});

	res.json(result);
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