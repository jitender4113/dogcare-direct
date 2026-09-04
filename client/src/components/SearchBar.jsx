function SearchBar() {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">

            <span className="text-gray-400">
                🔍
            </span>

            <input
                type="text"
                placeholder="Search anything..."
                className="w-52 border-none bg-transparent text-sm outline-none"
            />

        </div>
    );
}

export default SearchBar;