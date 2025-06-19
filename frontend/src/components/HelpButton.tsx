import { useHelpButtonStore } from "@/stores/helpButtonStore";
import { Button } from "./ui/button";
import useLoadingStore from "@/stores/loadingStore";

interface HelpButtonProps {
    className?: string
}

export function HelpButton({ className = "" }: HelpButtonProps) {
    const { isLoading } = useLoadingStore();
    const { helpCount, helpClicked, disabled } = useHelpButtonStore();
    return  <Button className={`absolute top-[6vh] left-[6vw] z-10 bg-blue-400 w-[150px] h-[150px] rounded-full hover:bg-blue-400 text-4xl text-wrap border-20 border-blue-300 ${className}`} onClick={helpClicked} disabled={isLoading || disabled}>
            <div className="absolute top-0 right-0 text-2xl bg-blue-500 rounded-full w-[40px] h-[40px] flex flex-col text-center justify-center items-center translate-x-2/3 -translate-y-1/2">
                {helpCount}
            </div>
            <div className="flex flex-col items-center">
                <span>ASK</span>
                <span>HELP</span>
            </div>
        </Button> 
}