import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// GET /api/artworks
// section: COMMUNITY, FEEDBACK
// limit: 50
// skip: 50
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession();

	const section: any = req.query.section;
	// const limit = req.query.limit ? () : () ?? 50;
	
	let limit: number;
	if (req.query.limit) {
		limit = parseInt(req.query.limit as string);
	} else {
		limit = 50;
	}
	const pageNum = req.query.page ? parseInt(req.query.page as string) : 0;

	// const userResult = await prisma.user.findUnique({
	// 	where: {
	// 		email: session?.user?.email || 'User is not logged in',
	// 	},
	// });

	const artworks = await prisma.artwork.findMany({
		take: limit,
		skip: 50 * pageNum,
		where: {
			section: section,
			// OR: [
			// 	{ section: section, mature: false },
			// 	{ section: section, mature: userResult?.showMatureContent || false },
			// ],
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	res.json(artworks);
	return;
}

// Mature content filtering is now done in the frontend (ArtworkGrid component)
