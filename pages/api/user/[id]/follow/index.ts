import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../lib/prisma';

// GET, POST & DELETE /api/user/[id]/follow
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	const session = await getSession({ req });

	if (session) {
		const userResult = await prisma.user.findUnique({
			// @ts-ignore
			where: { email: session?.user?.email },
		});
		if (req.method === 'GET') {
			const result = await prisma.follows.findUnique({
				where: {
					// @ts-ignore
					followerId_followingId: {
						// @ts-ignore
						followerId: userResult?.id,
						// @ts-ignore
						followingId: id,
					},
				},
			});
			res.json(result);
			return;
		} else if (req.method === 'POST') {
			const result = await prisma.follows.create({
				data: {
					// @ts-ignore
					following: { connect: { id: id } },
					// @ts-ignore
					follower: { connect: { id: userResult?.id } },
				},
			});
			res.json(result);
			return;
		} else if (req.method === 'DELETE') {
			const result = await prisma.follows.delete({
				where: {
					// @ts-ignore
					followerId_followingId: {
						// @ts-ignore
						followerId: userResult?.id,
						// @ts-ignore
						followingId: id,
					},
				},
			});

			res.json(result);
			return;
		}
	}
	res.status(401).send({ message: 'Unauthorized' });
}
