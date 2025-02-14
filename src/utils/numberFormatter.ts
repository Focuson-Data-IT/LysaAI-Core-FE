export const scoreFormatter = (number) => {
	return number?.toLocaleString("id-ID", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
};

export const followersValueFormatter = (number) => {
	return number?.toLocaleString("id-ID", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
};
