import Image from 'next/image';
import { useTheme } from 'next-themes';

const OurLoading = () => {
	const { theme } = useTheme();
	return (
		<div className="flex items-center justify-center h-screen">
		<div className="relative w-24 h-24 animate-pulse">
			<Image
				src={theme === "dark" ? "/logo_icon.svg" : "/logo_icon_d.svg"}
				alt="Animated Logo"
				width={96}
				height={96}
				className="transition-transform duration-500 ease-in-out transform hover:scale-110"
			/>
		</div>
		</div>
	);
};

export default OurLoading;
