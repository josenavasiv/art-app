/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	// reactStrictMode: true,
	images: {
		domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'app-artworks.sfo3.digitaloceanspaces.com'],
	},
};

module.exports = nextConfig;
