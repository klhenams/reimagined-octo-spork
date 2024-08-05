import React from 'react';
import Link from 'next/link';

const CustomError = ({ statusCode, title, message, actionLink, actionText }) => {
  return (
    <div className="min-h-scree bg-white rounded-xl shadow-2xl flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10">
        <div className="text-center">
          {statusCode && (
            <h1 className="text-9xl font-bold text-red-500">{statusCode}</h1>
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title || "Oops! Something went wrong."}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message || "We're sorry, but we couldn't complete your request."}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {actionLink && actionText && (
            <div className="text-center">
              <Link href={actionLink}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {actionText}
              </Link>
            </div>
          )}
          <div className="text-center">
            <Link href="/"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomError;