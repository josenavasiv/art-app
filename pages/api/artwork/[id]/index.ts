import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { Section } from '@prisma/client';
import s3Client from '../../../../lib/s3Client';

// PUT & DELETE /api/artwork/[id]

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query; // Artwork ID
	const bodyData = req.body;
	const newTitle: string = bodyData.title;
	const newDescription: string = bodyData.description;
	const newSection: Section = bodyData.section;
	const newMature: boolean = bodyData.mature;
	const newTags: boolean = bodyData.filteredTags;

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
						// @ts-ignore
						tags: newTags,
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
				try {
					// @ts-ignore
					const key: string = artworkResult.imageUrl.split('/').pop();
					// Delete the user's artwork post from prisma
					const deleteResult = await prisma.artwork.delete({
						where: { id: artworkResult?.id },
					});

					// Delete the image from the DO Space
					return s3Client.deleteObject(
						{
							Bucket: process.env.DO_SPACES_BUCKET as string,
							Key: key,
						},
						async () => res.status(201).send('File Deleted from prisma db and DO space.')
					);
				} catch (error) {
					res.status(500).send('Internal server error');
				}
			}
		} else {
			res.status(401).send({ message: 'Unauthorized. Please sign in' });
		}
	}
}

// Can only edit title and description of artwork PUT
