function NotificationButton() {
    return (
        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white">

            🔔

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500">
            </span>

        </button>
    );
}

export default NotificationButton;