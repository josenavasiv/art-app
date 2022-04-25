import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	// const limit = parseInt((req.query.limit as string) ?? 10);
	// const pageNum = req.query.page ? parseInt(req.query.page as string) : 0;

	const result = await prisma.comment.findMany({
		// take: limit,
		// skip: 10 * pageNum,
		// @ts-ignore
		where: { artworkId: id },
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(result);
}
