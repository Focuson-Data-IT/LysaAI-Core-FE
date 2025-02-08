export const scoreFormatter = (number) => {
	return number.toLocaleString("id-ID", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
};

export const followersValueFormatter = (number) => {
	return number?.toLocaleString("id-ID", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
};
