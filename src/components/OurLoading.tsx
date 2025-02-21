import { useTheme } from 'next-themes';

const OurLoading = () => {
	const { theme } = useTheme();

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="relative w-24 h-24">
				<svg
					width="96"
					height="96"
					viewBox="0 0 58 58"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-full"
				>
					<g clipPath="url(#clip0)">
						<path
							d="M0 25.0185C0.0595394 24.8948 0.0998609 24.7628 0.119571 24.6269C0.550258 19.2037 2.66327 14.0505 6.16335 9.88761C9.14735 6.22603 13.0428 3.4159 17.4574 1.7402C19.6012 0.855061 21.8728 0.318901 24.186 0.152049C25.8662 -0.00196921 27.5542 -0.0528272 29.2406 -0.000239198C30.705 0.125314 32.1582 0.357994 33.5886 0.695935C35.5679 1.10999 37.4808 1.79445 39.2737 2.73007C44.6057 5.37026 48.9247 9.68844 51.5678 15.0219C52.8102 17.5362 53.6641 20.2246 54.1005 22.9953C55.1433 29.5764 53.7354 36.3116 50.1438 41.9225L49.5785 42.7383"
							fill={theme === 'dark' ? '#FFF' : '#000'}
							className="animate-spin-slow origin-center"
						/>
						<path
							d="M38.8932 42.7603C38.2845 41.8575 38.2845 41.8575 37.4801 42.3796C35.1729 43.9389 32.5476 44.9644 29.7949 45.3818"
							fill={theme === 'dark' ? '#FFF' : '#000'}
							className="animate-spin origin-center"
						/>
					</g>
					<defs>
						<clipPath id="clip0">
							<rect width="58" height="58" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</div>
		</div>
	);
};

export default OurLoading;
