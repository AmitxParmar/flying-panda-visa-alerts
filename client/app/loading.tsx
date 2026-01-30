export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center dark:bg-slate-950">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Application</h2>
            <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
                Please wait while we prepare your session. Our server may take up to <span className="font-semibold text-blue-600">2 minutes</span> to boot up if it has been inactive.
            </p>
        </div>
    );
}
