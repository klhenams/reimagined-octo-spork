import CustomError from './CustomError';

const ErrorModal = ({ isOpen, onClose, ...errorProps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-ful max-w-lg">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <CustomError {...errorProps} />
      </div>
    </div>
  );
};

export default ErrorModal;