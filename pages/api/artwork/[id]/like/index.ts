import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../lib/prisma';

// GET, POST & DELETE /api/artwork/[id]/like
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const session = await getSession({ req });

	if (session) {
		const userResult = await prisma.user.findUnique({
			// @ts-ignore
			where: { email: session?.user?.email },
		});
		if (req.method === 'POST') {
			const result = await prisma.like.create({
				data: {
					// @ts-ignore
					artwork: { connect: { id: id } },
					// @ts-ignore
					author: { connect: { id: userResult?.id } },
				},
			});
			res.json(result);
			return;
		} else if (req.method === 'DELETE') {
			const result = await prisma.like.delete({
				where: {
					// @ts-ignore
					artworkId_authorId: {
						// @ts-ignore
						authorId: userResult?.id,
						// @ts-ignore
						artworkId: id,
					},
				},
			});
			res.json(result);
			return;
		}
		res.json(userResult);
		return;
	}
	res.status(401).send({ message: 'Unauthorized' });
}
