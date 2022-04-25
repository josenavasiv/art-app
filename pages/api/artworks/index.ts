import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// GET /api/artworks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession();

	const limit = parseInt((req.query.limit as string) ?? 50);
	const pageNum = req.query.page ? parseInt(req.query.page as string) : 0;

	const userResult = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || 'User is not logged in',
		},
	});

	console.log(session);

	const artworks = await prisma.artwork.findMany({
		take: limit,
		skip: 50 * pageNum,
		where: {
			OR: [
				{ section: 'COMMUNITY', mature: false },
				{ section: 'COMMUNITY', mature: userResult?.showMatureContent || false },
			],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(artworks);
	return;
}
