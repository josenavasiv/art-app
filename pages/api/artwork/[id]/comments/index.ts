import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const result = await prisma.comment.findMany({
		// @ts-ignore
		where: { artworkId: id },
	});

	res.json(result);
}
