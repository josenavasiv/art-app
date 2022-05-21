// @ts-nocheck
import fs from 'fs';
// import AWS from 'aws-sdk';
import formidable from 'formidable';
import s3Client from '../../../lib/s3Client';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/digitaloceans3
// Store user images to the digital ocean space

// const s3Client = new AWS.S3({
// 	endpoint: process.env.DO_SPACES_URL,
// 	region: 'sfo3',
// 	credentials: {
// 		accessKeyId: process.env.DO_SPACES_ID,
// 		secretAccessKey: process.env.DO_SPACES_SECRET,
// 	},
// });

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handle(req, res) {
	const userid = req.query.userid;
	const form = formidable();
	form.parse(req, async (err, fields, files) => {
		console.log(files.file);
		if (!files.file) {
			res.status(400).send('No file uploaded');
			return;
		}

		try {
			return s3Client.putObject(
				{
					Bucket: process.env.DO_SPACES_BUCKET,
					Key: `${userid}_${files.file.originalFilename}`,
					Body: fs.createReadStream(files.file.filepath),
					ACL: 'public-read',
				},
				async () =>
					res.status(201).send({
						do_url: `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_URL}/${userid}_${files.file.originalFilename}`,
					})
			);
		} catch (error) {
			res.status(500).send('Internal server error');
		}
	});
	return;
}

// https://app-artworks.sfo3.digitaloceanspaces.com/eye.jpg
