import WelcomeHeader from "./WelcomeHeader";
import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";

function Header() {
    return (
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <WelcomeHeader />

            <div className="flex w-full items-center gap-3 md:w-auto">
                <SearchBar />
                <NotificationButton />
            </div>

        </header>
    );
}

export default Header;