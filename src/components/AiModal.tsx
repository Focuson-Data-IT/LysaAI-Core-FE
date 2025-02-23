import React from 'react';
import { marked } from 'marked';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: { summary?: string } | null;
    isLoading: boolean;
}

/**
 * Fungsi untuk memformat teks dari AI agar lebih enak dibaca:
 * - Heading lebih besar dan jelas
 * - Paragraf diberi jarak
 * - List memiliki indentasi dan spasi yang nyaman
 */
const formatAISummary = (text: string) => {
    if (!text) return '';

    // Bersihkan dan konversi Markdown ke HTML
    const cleanedText = text
        .replace(/###\s?/g, '## ') // Heading ke tingkat 2
        .replace(/\*\*(.*?)\*\*/g, '**$1**') // Pertahankan bold

    return marked.parse(cleanedText);
};

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, data, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-[650px] max-h-[80vh] overflow-y-auto p-6 relative">
                
                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Judul */}
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                    AI Summary
                </h2>

                {/* Konten */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="w-10 h-10 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                    </div>
                ) : data?.summary ? (
                    <div
                        className="prose dark:prose-invert text-sm max-w-full text-justify space-y-4"
                        style={{
                            lineHeight: "1.75",
                            wordSpacing: "0.05em",
                            letterSpacing: "0.01em"
                        }}
                        dangerouslySetInnerHTML={{ __html: formatAISummary(data.summary) }}
                    />
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No data available.</p>
                )}
            </div>
        </div>
    );
};

export default AIModal;
