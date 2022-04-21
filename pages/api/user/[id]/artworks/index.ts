import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';

// GET /api/user/[id]/artworks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	// @ts-ignore
	const id = req.query.id;
	// @ts-ignore
	const limit = parseInt(req.query.limit);

	const session = await getSession({ req });
	const userResult = await prisma.user.findUnique({
		where: { email: session?.user?.email || 'User is not logged in' },
	});

	const userArtworks = await prisma.artwork.findMany({
		// @ts-ignore
		take: limit || 6,
		where: {
			OR: [
				{
					// @ts-ignore
					authorId: id,
					mature: false,
				},
				{
					// @ts-ignore
					authorId: id,
					mature: userResult?.showMatureContent || false,
				},
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(userArtworks);
}
