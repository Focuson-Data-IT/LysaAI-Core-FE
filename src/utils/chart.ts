import moment from "moment";
import {primaryColors} from "@/constant/PerfomanceContants";

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
		const existing = groupedByUsername[key].find(entry =>
			moment(entry.date).isSame(moment(item.date), 'day')
		);

		if (existing) {
			// Tambahkan nilai `value` jika tanggal sama
			existing.value = (parseFloat(existing.value || 0) + parseFloat(item.value || 0)).toFixed(2);
		} else {
			groupedByUsername[key].push(item);
		}
	});

	Object.keys(groupedByUsername).forEach((key) => {
		groupedByUsername[key].sort((a, b) => {
			return moment(a.date).valueOf() - moment(b.date).valueOf();
		});
	});

	return groupedByUsername;
};

export const buildDatasets = (groupedData, labels, options: any) => {
	let filteredData: any = Object.entries(groupedData);

	if (options) {
		filteredData = Object.entries(groupedData).filter(
			([username]: any) =>
				options?.filterByUsername?.length === 0 ||
				options?.filterByUsername?.includes(username)
		);
	}

	let sortedData = filteredData
		.map(([username, userData]) => {
			const totalValue = userData.reduce((sum, item) => sum + parseFloat(String(item.value || 0)), 0);
			const lastValue = parseFloat(String(userData[userData.length - 1]?.value)) || 0;
			return {username, userData, totalValue, lastValue};
		});

	sortedData.sort((a, b) => b.lastValue - a.lastValue)
		.slice(0, 5);

	const datasets = sortedData.map(({username, userData}) => {
		const dataWithZeroes = labels.map((label) => {
			const dataPoint = userData.find((item) => {
				return moment(item.date, "YYYY-MM-DD").isSame(moment(label, "YYYY-MM-DD"));
			});
			return dataPoint ? parseFloat(String(dataPoint?.value)) : null;
		});

		return {
			label: username,
			data: dataWithZeroes,
			borderColor: "#22C55E",
			pointBorderColor: "#ffffff",
			pointBackgroundColor: "#22C55E",
			pointBorderWidth: 4,
			borderWidth: 3,
			fill: true,
			tension: 0.4,
		};
	});

	return datasets;
};

export const generateColors = (index, opacity?) => {
	return index < primaryColors.length ? primaryColors[index] + (opacity ? opacity : "") : "#BDC3C7" + (opacity ? opacity : "");
};

export const buildDatasetsPie = (groupedData, options: any) => {
	let filteredData: any = Object.entries(groupedData);

	if (options) {
		filteredData = Object.entries(groupedData).filter(
			([username]: any) =>
				options?.filterByUsername?.length === 0 ||
				options?.filterByUsername?.includes(username)
		);
	}

	let sortedData = filteredData
		.map(([username, userData]) => {
			const totalValue = userData.reduce((sum, item) => sum + parseFloat(String(item.value || 0)), 0);
			return { username, totalValue };
		})
		.sort((a, b) => b.totalValue - a.totalValue)
		.slice(0, 10);

	const labels = sortedData.map(({ username }) => username);
	const data = sortedData.map(({ totalValue }) => totalValue);

	return {
		labels,
		datasets: [{
			data,
			backgroundColor: [
				"#6A5ACD", "#FFB347", "#20B2AA", "#FF6347", "#FFD700"
			],
		}],
	};
};

export const createGradient = (chartRef) => {
	if (!chartRef?.current) return "#22C55E";
	const ctx = chartRef.current.getContext("2d");
	const gradient = ctx.createLinearGradient(0, 0, 0, 450);
	// gradient.addColorStop(0, "rgba(34, 197, 94, 0.41)");
	// gradient.addColorStop(0.6, "rgba(255, 255, 255, 0)");
	return gradient;
};

