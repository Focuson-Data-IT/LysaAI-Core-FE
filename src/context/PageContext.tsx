import { createContext, useContext, useState, ReactNode } from "react";

interface PageStore {
    from: string;
    to: string;
    action: string;
    detail: boolean;
}

interface PageContextProps {
    pageStore: PageStore;
    setPageStore: (store: PageStore) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
    const [pageStore, setPageStore] = useState<PageStore>({
        from: "page",
        to: "page",
        action: "PAGE_LOADED",
        detail: true,
    });

    return (
        <PageContext.Provider value={{ pageStore, setPageStore }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePageStore = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePageStore must be used within a PageProvider");
    }
    return context;
};
