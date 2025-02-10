export const performanceBuilder = (contents) => {
    if (!Array.isArray(contents)) {
        throw new Error("Invalid input. 'contents' must be an array.");
    }

    // Ambil nilai performaKonten dari semua konten
    const performaValues = contents.map(content => content.performaKonten);

    // Urutkan nilai performa untuk mempermudah perhitungan persentil
    performaValues.sort((a, b) => a - b);

    // Fungsi untuk menghitung nilai persentil
    const getPercentileValue = (percentile) => {
        const index = Math.floor((percentile / 100) * (performaValues.length - 1));
        return performaValues[index];
    };

    // Hitung ambang batas untuk setiap kategori
    const worstThreshold = getPercentileValue(10); // Persentil 10
    const bestThreshold = getPercentileValue(90); // Persentil 90

    // Tambahkan level/kategori ke setiap konten
    const categorizedContents = contents.map(content => {
        const performance = content.performaKonten;

        let level = "Medioker"; // Default kategori adalah Medioker
        if (performance <= worstThreshold) {
            level = "Worst";
        } else if (performance >= bestThreshold) {
            level = "Best";
        }

        return {
            ...content,
            level, // Tambahkan properti level ke konten
        };
    });

    return categorizedContents;
};