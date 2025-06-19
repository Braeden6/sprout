import { create } from "zustand";

interface LoadingStore {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}


const useLoadingStore = create<LoadingStore>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

export default useLoadingStore;