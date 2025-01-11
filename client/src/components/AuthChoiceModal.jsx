import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AuthChoiceModal = ({ isOpen, onClose, onContinueAsGuest }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    localStorage.setItem('returnTo', location.pathname);
    navigate('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Would you like to login?
          </h2>
          <p className="text-gray-600">
            Logging in allows you to track your prayers/praises in your dashboard. You can also continue as a guest.
          </p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-[#409F9C] text-white rounded hover:bg-[#368B88] transition-colors"
          >
            Login
          </button>
          <button
            onClick={onContinueAsGuest}
            className="px-4 py-2 border-2 border-[#409F9C] text-[#409F9C] rounded hover:bg-gray-50 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
AuthChoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinueAsGuest: PropTypes.func.isRequired,
};

export default AuthChoiceModal;