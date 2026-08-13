import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
                <h1 className="text-3xl font-bold text-black">POS Minimarket is Working! 🎉</h1>
                <div className="mt-8 flex gap-4">
                    {auth.user ? (
                        <Link href={dashboard()} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
