export interface PageStore {
    from: string;
    to: string;
    action: string;
    detail: boolean;
}

export interface PageContextProps {
    pageStore: PageStore;
    setPageStore: (store: PageStore) => void;
}