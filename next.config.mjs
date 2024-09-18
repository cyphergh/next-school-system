/** @type {import('next').NextConfig} */
const nextConfig = {    
    typescript:{
        ignoreBuildErrors: true,
    },
    experimental: {
		serverActions: {
			allowedForwardedHosts: ['localhost:3000','pwjjg8q4-3000.uks1.devtunnels.ms'],
			allowedOrigins: ['localhost:3000','pwjjg8q4-3000.uks1.devtunnels.ms']
		},
	},
	distDir: 'build',	  
};

export default nextConfig;
