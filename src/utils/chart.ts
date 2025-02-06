import moment from "moment";

export const buildLabels = (startDate, endDate) => {
	const dateArray = [];

	const start = moment(startDate);
	const end = moment(endDate);

	while (start.isSameOrBefore(end, "day")) {
		dateArray.push(start.clone());
		start.add(1, "day");
	}

	return dateArray;
}

export const groupDataByUsername = (data) => {
	if (!Array.isArray(data)) return {};

	const groupedByUsername = {};

	data.forEach((item) => {
		const key = item.username;
		if (!groupedByUsername[key]) {
			groupedByUsername[key] = [];
		}
		groupedByUsername[key].push(item);
	});

	Object.keys(groupedByUsername).forEach((key) => {
		groupedByUsername[key].sort((a, b) => {
			return moment(a.date).valueOf() - moment(b.date).valueOf();
		});
	});

	return groupedByUsername;
};

export const buildDatasets = (groupedData, labels, options: any) => {
	// Filter data berdasarkan username yang diinginkan
	const filteredData: any = Object.entries(groupedData).filter(
		([username]: any) =>
			options?.filterByUsername?.length === 0 ||
			options?.filterByUsername?.includes(username)
	);

	// Menghitung total nilai (value) dari masing-masing pengguna
	const sortedData = filteredData
		.map(([username, userData]) => {
			const totalValue = userData.reduce((sum, item) => sum + item.value, 0);
			return { username, userData, totalValue };
		})
		.sort((a, b) => b.totalValue - a.totalValue) // Urutkan dari terbesar ke terkecil
		.slice(0, 10); // Ambil hanya 10 pengguna teratas

	// Membuat dataset hanya untuk 10 pengguna dengan nilai terbesar
	const datasets = sortedData.map(({ username, userData }) => {
		const dataWithZeroes = labels.map((label) => {
			const dataPoint = userData.find((item) =>
				moment(item.date, "YYYY-MM-DD").isSame(moment(label, "YYYY-MM-DD"))
			);
			return dataPoint ? dataPoint.value : 0;
		});

		return {
			label: username,
			data: dataWithZeroes,
			borderColor: "#22C55E",
			pointBorderColor: "#ffffff",
			pointBackgroundColor: "#22C55E",
			pointBorderWidth: 4,
			borderWidth: 2,
			fill: true,
			tension: 0,
		};
	});

	return datasets;
};


export const createGradient = (chartRef) => {
	if (!chartRef?.current) return "#22C55E";
	const ctx = chartRef.current.getContext("2d");
	const gradient = ctx.createLinearGradient(0, 0, 0, 450);
	// gradient.addColorStop(0, "rgba(34, 197, 94, 0.41)");
	// gradient.addColorStop(0.6, "rgba(255, 255, 255, 0)");
	return gradient;
};

