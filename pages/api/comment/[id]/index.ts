import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// PUT | DELETE /api/comment/[id]

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const commentId: string | string[] = req.query.id;
	const bodyData = req.body;
	const newContent: string = bodyData.newContent;
	const commentAuthorId: string = bodyData.authorId;

	const session = await getSession({ req });

	if (session) {
		// Grab the current logged-in user via the session
		const userResult = await prisma.user.findUnique({
			// @ts-ignore
			where: { email: session?.user?.email },
		});
		const userId = userResult?.id;

		// Check if the logged-in user has the right to modify the comment
		if (commentAuthorId === userId) {
			if (req.method === 'PUT') {
				// Update the description and title of the specified artwork
				const updatedCommentResult = await prisma.comment.update({
					// @ts-ignore
					where: { id: commentId },
					data: {
						content: newContent,
					},
				});
				res.json(updatedCommentResult);
			} else if (req.method === 'DELETE') {
				// Delete the user's artwork post
				const deletedCommentResult = await prisma.comment.delete({
					// @ts-ignore
					where: { id: commentId },
				});
				res.json(deletedCommentResult);
			}
		} else {
			res.status(401).send({ message: 'Unauthorized. Please sign in' });
		}
	}
}

// if (req.method === 'PUT') {
// 	// Check if the userId === authorId of comment
// 	const commentResult = await prisma.comment.findUnique({
// 		// @ts-ignore
// 		where: { id: commentId },
// 	});

// 	if (commentResult?.authorId === userId) {
// 		// Update the description and title of the specified artwork
// 		const updatedCommentResult = await prisma.comment.update({
// 			where: { id: commentResult?.id },
// 			data: {
// 				content: newContent,
// 			},
// 		});
// 		res.json(updatedCommentResult);
// 	}
// } else if (req.method === 'DELETE') {
// 	// Check if the userId === authorId of comment
// 	const commentResult = await prisma.comment.findUnique({
// 		// @ts-ignore
// 		where: { id: commentId },
// 	});
// 	if (commentResult?.authorId === userId) {
// 		// Delete the user's artwork post
// 		const deletedCommentResult = await prisma.artwork.delete({
// 			where: { id: commentResult?.id },
// 		});
// 		res.json(deletedCommentResult);
// 	}
// } else {
// 	res.status(401).send({ message: 'Unauthorized. Please sign in' });
// }
