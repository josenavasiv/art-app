import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

// GET /api/user/[id]/artworks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	// @ts-ignore
	const id = req.query.id;
	// @ts-ignore
	const limit = parseInt(req.query.limit);

	const userArtworks = await prisma.artwork.findMany({
		// @ts-ignore
		take: limit || 6,
		where: {
			// @ts-ignore
			authorId: id,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(userArtworks);
}
