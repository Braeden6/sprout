import { Loader2 } from "lucide-react";
import useLoadingStore from "@/stores/loadingStore";

const Loading = () => { 
    const { isLoading } = useLoadingStore();
    return (
        isLoading ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="rounded-lg p-8 shadow-lg">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                </div>
            </div>
        ) : null
    )
}

export default Loading;