import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Gamepad, HouseIcon, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from '@tanstack/react-router';

const paths = [
    {
        path: "/",
        icon: <HouseIcon className="!w-12 !h-12" />
    },
    {
        path: "/games/face",
        icon: <Gamepad className="!w-12 !h-12" />
    },
    {
        path: "/profile",
        icon: <UserRound className="!w-12 !h-12" />
    }
]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Drawer Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-30 transition-opacity duration-300"
                    onClick={toggleDrawer}
                />
            )}

            <div className={`fixed top-1/2 right-0 -translate-y-1/2 z-40 w-[500px] h-[900px] transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-[100px]' : 'translate-x-[330px]'
            }`}>
                <img 
                    src="/sidebar.svg" 
                    alt="Sidebar Background" 
                    className="absolute top-0 right-0 w-full h-full" 
                />

                <Button
                    onClick={toggleDrawer}
                    variant="ghost"
                    className="absolute top-[130px] left-[100px] h-[230px] w-[70px] hover:bg-transparent cursor-pointer"
                >
                    {
                        isOpen ? (
                            <ChevronRight className="!w-12 !h-12 text-black" />
                        ) : (
                            <ChevronLeft className="!w-12 !h-12 text-black" />
                        )
                    }
                </Button>

                <div className="relative flex flex-col z-10 left-1/3 top-1/2 -translate-y-1/2 overflow-y-auto text-black items-center justify-center space-y-30 w-1/2 h-full">
                    {
                        paths.map((path) => (
                            <Button variant="ghost" className={`hover:bg-gray-200/50 w-40 h-20 ${location.pathname === path.path ? "!bg-gray-400/50" : ""} cursor-pointer`} onClick={() => navigate({ to: path.path })}>
                                {path.icon}
                            </Button>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Sidebar;