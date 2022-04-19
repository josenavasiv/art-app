import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Section } from '@prisma/client';

// POST /api/upload
// Required fields in body

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const bodyData = req.body;
	const title: string = bodyData.title;
	const description: string = bodyData.description;
	const section: Section = bodyData.section;
	const image_url: string = bodyData.image_url;
	const mature: boolean = bodyData.mature;

	const session = await getSession({ req });
	// @ts-ignore
	const userName: string = session?.user?.name;
	// @ts-ignore
	const userEmail: string = session?.user?.email; // Connect to Upload within prisma via email
	if (session) {
		const result = await prisma.artwork.create({
			data: {
				title: title,
				description: description,
				section: section,
				imageUrl: image_url,
				thumbnailUrl: image_url,
				authorName: userName,
				mature: mature,
				author: { connect: { email: userEmail } },
			},
		});
		res.json(result);
	} else {
		res.status(401).send({ message: 'Unauthorized. Please login to upload artwork.' });
	}
}
