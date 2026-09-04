import { Menu } from "lucide-react";
import WelcomeHeader from "./WelcomeHeader";
import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";

function Header({ onMenuClick, notificationCount = 0 }) {
    return (
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>
                <WelcomeHeader />
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
                <SearchBar />
                <NotificationButton count={notificationCount} />
            </div>
        </header>
    );
}

export default Header;
