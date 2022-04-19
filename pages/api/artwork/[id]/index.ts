import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { Section } from '@prisma/client';

// PUT & DELETE /api/artwork/[id]

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query; // Artwork ID
	const bodyData = req.body;
	const newTitle: string = bodyData.title;
	const newDescription: string = bodyData.description;
	const newSection: Section = bodyData.section;
	const newMature: boolean = bodyData.mature;

	const session = await getSession({ req });

	if (session) {
		// Grab the current logged-in user via the session
		const userResult = await prisma.user.findUnique({
			// @ts-ignore
			where: { email: session?.user?.email },
		});
		const userId = userResult?.id;

		if (req.method === 'PUT') {
			// Check if the userId === authorId of artwork
			const artworkResult = await prisma.artwork.findUnique({
				// @ts-ignore
				where: { id: id },
			});

			if (artworkResult?.authorId === userId) {
				// Update the description and title of the specified artwork
				const updateResult = await prisma.artwork.update({
					where: { id: artworkResult?.id },
					data: {
						title: newTitle,
						description: newDescription,
						section: newSection,
						mature: newMature,
					},
				});
				res.json(updateResult);
			}
		} else if (req.method === 'DELETE') {
			// Check if the userId === authorId of artwork
			const artworkResult = await prisma.artwork.findUnique({
				// @ts-ignore
				where: { id: id },
			});
			if (artworkResult?.authorId === userId) {
				// Delete the user's artwork post
				const deleteResult = await prisma.artwork.delete({
					where: { id: artworkResult?.id },
				});
				res.json(deleteResult);
			}
		} else {
			res.status(401).send({ message: 'Unauthorized. Please sign in' });
		}
	}
}

// Can only edit title and description of artwork PUT
