interface OurEmptyDataProps {
	width: number;
}

const OurEmptyData = ({width}: OurEmptyDataProps) => {
	return (
		<div
			className={`text-gray-700 dark:text-white flex flex-center items-center flex-col justify-center h-full`}>
			<img src="/empty.png" alt="empty data" width={width}/>
			<p>No Data Result</p>
		</div>

	);
}

export default OurEmptyData;
