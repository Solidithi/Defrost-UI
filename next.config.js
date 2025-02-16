/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "images.unsplash.com",
            "www.facebook.com",
            "scontent.fsgn5-13.fna.fbcdn.net", // Add the Facebook CDN domain
            "i.seadn.io", // Add the Seadn CDN domain
            "www.google.com", // Add the Google CDN domain
            "i.pinimg.com", // Add the Pinterest CDN domain
        ],
    }
}

module.exports = nextConfig
