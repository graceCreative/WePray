import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Unauthorized Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    You don&apos;t have permission to access this page.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <Link
                        to="/dashboard"
                        className="text-blue-600 hover:text-blue-500"
                    >
                        Go to Dashboard
                    </Link>
                    <button
                        onClick={logout}
                        className="text-red-600 hover:text-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Unauthorized