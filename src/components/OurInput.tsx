import React, { useState, useRef, useEffect } from "react";

const OurInput = ({ value, onChange, placeholder, withSearchResult = false, searchResult, setSearchQuery }) => {
    const [results, setResults] = useState([]);
    const containerRef = useRef(null); // Reference untuk tracking elemen

    const handleChange = async (e) => {
        // Jalankan fungsi onChange
        onChange(e);

        if (!e.target.value.length) {
            setResults([]);
            withSearchResult = false;
        }

        // Jika withSearchResult aktif dan searchResult adalah fungsi, ambil data
        if (withSearchResult && typeof searchResult === "function") {
            try {
                const resultsData = await searchResult(); // Panggil fungsi searchResult
                setResults(resultsData || []);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            }
        }
    };

    const handleOutsideClick = (event) => {
        // Jika user mengklik di luar elemen container
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setResults([]); // Kosongkan hasil pencarian (popup ditutup)
        }
    };

    useEffect(() => {
        // Tambahkan event listener untuk menangkap klik di luar
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            // Saat komponen di-unmount, hapus event listener
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <input
                type="text"
                placeholder={placeholder}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg ml-5"
                value={value}
                onChange={handleChange} // Gunakan handleChange sebagai event handler
            />
            {withSearchResult && results.length > 0 && (
                <ul
                    className="absolute ml-5 w-full max-h-[200] overflow-y-scroll bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-1"
                    style={{
                        zIndex: 100,
                    }}
                >
                    {results.map((result, index) => (
                        <li
                            key={index}
                            className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => {
                                setSearchQuery(result); // Set nilai hasil pencarian
                                setResults([]); // Sembunyikan popup setelah item diklik
                            }}
                        >
                            {result}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OurInput;