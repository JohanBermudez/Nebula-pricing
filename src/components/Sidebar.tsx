import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  LineChart, 
  Bell, 
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Comparación', href: '/productos', icon: BarChart2 },
    { name: 'Historial', href: '/historial-precios', icon: LineChart },
    { name: 'Alertas', href: '/alertas', icon: Bell },
    { name: 'Sellers', href: '/sellers', icon: ShoppingBag },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 bg-indigo-700 text-white p-2 rounded-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky top-0 left-0 w-64 h-screen bg-indigo-900 text-white transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center p-4 border-b border-indigo-800">
          <div className="bg-indigo-700 text-white rounded-md p-2 mr-2">
            <span className="text-xl font-bold">N</span>
          </div>
          <h1 className="text-xl font-semibold">Nebula</h1>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-4 rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-100 hover:bg-indigo-800'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
