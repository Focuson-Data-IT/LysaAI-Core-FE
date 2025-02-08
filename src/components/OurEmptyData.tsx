interface OurEmptyDataProps {
	width: number;
}

const OurEmptyData = ({width}: OurEmptyDataProps) => {
	return (
		<div
			className={`text-gray-700 dark:text-white flex flex-center items-center flex-col justify-center h-full`}>
			<img src="/logo_icon.svg" alt="empty data" width={width}/>
		</div>

	);
}

export default OurEmptyData;
