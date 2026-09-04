import { Bell } from "lucide-react";

function NotificationButton({ count = 0 }) {
    return (
        <button className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50">
            <Bell size={18} className="text-gray-500" />

            {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </button>
    );
}

export default NotificationButton;
