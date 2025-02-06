import Image from "next/image";


const OurLoading = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex items-center justify-center w-full h-full">
				<Image
					src="/logo-focus-on-d.png"
					alt="Loading"
					width={500}
					height={500}
				/>
			</div>
		</div>
	);
}

export default OurLoading;
