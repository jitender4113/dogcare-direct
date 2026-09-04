function WelcomeHeader() {
    return (
        <div>
            <p className="text-xs font-bold tracking-widest text-green-600">
                WELCOME BACK 👋
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                Hey Admin!
            </h1>
            <p className="mt-2 max-w-md text-sm text-gray-500">
                Here's what's happening at your shelter today.
            </p>
        </div>
    );
}

export default WelcomeHeader;