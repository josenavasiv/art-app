import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

// POST /api/artwork/[id]/comment
// Creating a new comment onto the specified [id]

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	const bodyData = req.body;
	const content: string = bodyData.content;
	const session = await getSession({ req });

	// @ts-ignore
	const userEmail: string = session?.user?.email; // Connect to Upload within prisma via email
	if (session) {
		const result = await prisma.comment.create({
			data: {
				content: content,
				// @ts-ignore
				artwork: { connect: { id: id } },
				author: { connect: { email: userEmail } },
			},
		});
		res.json(result);
	} else {
		res.status(401).send({ message: 'Unauthorized' });
	}
}
