import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

// GET /api/user/[id]/artworks
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	// @ts-ignore
	const { id } = req.query.id;

	const userArtworks = await prisma.artwork.findMany({
		take: 6,
		where: {
			authorId: id,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(userArtworks);
}
