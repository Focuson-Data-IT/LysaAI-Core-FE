export const scoreFormatter = (number) => {
	return number?.toLocaleString("id-ID", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
};

export const numberFormatter = (value) => {
    if (typeof value !== "number" || isNaN(value)) return value; // Jika bukan angka, kembalikan nilai aslinya

    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(0) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
    
    return value.toString(); // Pastikan angka dikembalikan dalam bentuk string
};


export const followersValueFormatter = (number) => {
	return number?.toLocaleString("id-ID", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
};
