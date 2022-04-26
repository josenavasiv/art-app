import AWS from 'aws-sdk';

const s3Client = new AWS.S3({
	endpoint: process.env.DO_SPACES_URL,
	region: 'sfo3',
	credentials: {
		accessKeyId: process.env.DO_SPACES_ID as string,
		secretAccessKey: process.env.DO_SPACES_SECRET as string,
	},
});

export default s3Client;
