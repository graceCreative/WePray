import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');
                
                if (token) {
                    await loginWithGoogle(token);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [loginWithGoogle, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-lg font-semibold">Processing login...</h2>
            </div>
        </div>
    );
};

export default AuthCallback;