'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <nav className="flex border-b mb-6">
        <Link 
          href="/dashboard/settings/general" 
          className={`mr-6 py-2 border-b-2 ${
            pathname.includes('/general') 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          General
        </Link>
        <Link 
          href="/dashboard/settings/billing" 
          className={`py-2 border-b-2 ${
            pathname.includes('/billing') 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          Billing & Usage
        </Link>
      </nav>
      {children}
    </div>
  );
}