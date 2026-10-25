import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ClipboardList,
  LogOut,
  PlusCircle,
  Ticket,
  ListOrdered,
  Link2,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { SUPER_ADMIN_ID } from '../../lib/constants/admin';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  {
    name: 'Orders', 
    to: '/orders',
    icon: ClipboardList,
    children: [
      { name: 'Order List', to: '/orders', icon: ListOrdered },
      { name: 'Order by Email', to: '/ordersemail', icon: ListOrdered },
      { name: 'New Order', to: '/orders/new', icon: PlusCircle }
    ]
  },
  { name: 'Generated checkout links', to: '/checkout-links', icon: Link2 },
  {
    name: 'Coupons',
    to: '/coupons',
    icon: Ticket,
    children: [
      { name: 'Create Coupon', to: '/coupons/new', icon: PlusCircle }
    ]
  }
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const adminId = useAuthStore((state) => state.getAdminId());
  const location = useLocation();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const navigationItems = React.useMemo(() => {
    const items = [...navigation];
    if (adminId === SUPER_ADMIN_ID) {
      items.push({ name: 'Agents', to: '/agents', icon: Users });
    }
    items.push({ name: 'Product Pricing', to: '/pricing', icon: DollarSign });
    return items;
  }, [adminId]);

  React.useEffect(() => {
    const path = location.pathname;
    const ordersOpen =
      path.startsWith('/orders') ||
      path.startsWith('/ordersemail');
    if (ordersOpen) {
      setExpandedItem('Orders');
    }
  }, [location.pathname]);

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <img 
          src={logo}
          alt="WhiteLabelMD Logo"
          className="h-12 w-auto logo_my"
        />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.name} className="py-1">
            {item.children ? (
              <div>
                <button
                  onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                  className={cn(
                    'w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl',
                    'transition-all duration-300 ease-in-out',
                    'group hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50',
                    expandedItem === item.name 
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700' 
                      : 'text-gray-600'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3 transition-colors duration-300 group-hover:text-primary-600" />
                  <span className="font-medium">{item.name}</span>
                </button>
                <div
                  className={cn(
                    'mt-1 ml-4 space-y-1 transition-all duration-300',
                    expandedItem === item.name ? 'block' : 'hidden'
                  )}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.to}
                      onClick={handleNavigation}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-3 text-sm rounded-xl group transition-all duration-300',
                          'hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50',
                          isActive
                            ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700'
                            : 'text-gray-600 hover:text-primary-700'
                        )
                      }
                    >
                      <child.icon className="h-4 w-4 mr-3 transition-colors duration-300 group-hover:text-primary-600" />
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300',
                    'group hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50',
                    isActive
                      ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-700'
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-3 transition-colors duration-300 group-hover:text-primary-600" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl
                     text-gray-600 hover:text-red-600 hover:bg-red-50
                     transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 mr-3 transition-colors duration-300 group-hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}