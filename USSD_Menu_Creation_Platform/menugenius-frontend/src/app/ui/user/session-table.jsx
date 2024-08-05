import { format } from 'date-fns';
import { useState } from 'react';

export default function SessionTable({ sessionData, error, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const sessionDataPerPage = 8;
  const totalPages = Math.ceil(sessionData.length / sessionDataPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentSessionData = sessionData.slice(
    (currentPage - 1) * sessionDataPerPage,
    currentPage * sessionDataPerPage
  );

  if (loading) return <div className="flex justify-center items-center py-20"><span className="loading loading-dots loading-lg"></span></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (sessionData.length === 0 ){
    return <div className='text-lg sm:text-2xl font-semibold text-center text-slate-700 mt-4'>NO Session Data For This Menu </div>
  }

  return (
    <>
    <div className="overflow-x-auto mt-4">
      <table className="table">
        {/* head */}
        <thead className="bg-blue-50">
          <tr>
            <th>Session Id</th>
            <th>Phone Number</th>
            <th>Response</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentSessionData.map((session) => (
            <tr className="hover:bg-gray-100" key={session.session_id}>
              <th className="font-normal">{session.session_id}</th>
              <td>{session.phone_number}</td>
              <td>{session.user_responses}</td>
              <td>{format(new Date(session.date), 'MMMM dd, yyyy h:mm a')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-end absolute bottom-10 right-5">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 mx-1 bg-gray-200 rounded"
    >
      Previous
    </button>
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`px-4 py-2 mx-1 ${
          currentPage === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 mx-1 bg-gray-200 rounded"
    >
      Next
    </button>
  </div>
  </>
  );
}
