const nextConfig: {
    eslint: any;
    output?: string;
    images?: { unoptimized?: boolean };
    assetPrefix?: string;
    basePath?: string;
    reactStrictMode?: boolean
} = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    images: {
        unoptimized: true,
    },
    output: process.env.NEXT_PUBLIC_OUTPUT,
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;