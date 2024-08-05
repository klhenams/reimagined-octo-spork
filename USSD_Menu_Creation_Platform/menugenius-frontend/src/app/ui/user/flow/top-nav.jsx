import axiosInstance from '@/app/utils/axios';
import { ArrowLeftIcon, LinkIcon, LucideFileJson } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TopNavBar = ({ menuId }) => {
    const [menuName, setMenuName] = useState('Loading...');
    const testLink = `https://menugenius.azurewebsites.net/ussd/${menuId}/`;
    const [showCopied, setShowCopied] = useState(false);

  
    useEffect(() => {
      const fetchMenuName = async () => {
        try {
          const response = await axiosInstance.get(`/api/menu/${menuId}/`);
          setMenuName(response.data.name);
        } catch (error) {
          console.error('Error fetching menu name:', error);
          setMenuName('Menu');
        }
      };
  
      fetchMenuName();
    }, [menuId]);

    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText(testLink);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 1000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

  return (
    <nav className="bg-white p-4 mb-6 fixed top-0 right-0 z-10 lg:left-64 left-0">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold text-black">{menuName}</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <p className=' hidden sm:block font-semibold text-sm whitespace-nowrap'>Callback url:</p>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-grow sm:flex-grow-0 relative">
      <input 
        type="text" 
        value={testLink} 
        readOnly 
        className="bg-transparent text-sm mr-2 w-full sm:w-auto"
      />
      <button 
        onClick={handleCopyClick}
        className="text-blue-500 hover:text-blue-700 flex-shrink-0 relative"
      >
        <LinkIcon className="h-5 w-5" />
        {showCopied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded">
            Link Copied!
          </span>
        )}
      </button>
    </div>

            <Link 
              href={`/dashboard/responses/${menuId}`} 
              className="text-gray-600 hover:text-gray-800"
            >
              <div className='bg-gray-200 p-2 rounded-lg'>
                <LucideFileJson className="h-6 w-6 text-blue-500 hover:text-blue-700" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;