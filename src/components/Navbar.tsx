import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center w-full max-w-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
            placeholder="Buscar productos, sellers..."
          />
        </div>
      </div>

      <div className="flex items-center">
        <button className="p-2 relative text-gray-500 hover:text-gray-700 focus:outline-none mr-4">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center">
          <div className="hidden md:flex flex-col items-end mr-3">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
