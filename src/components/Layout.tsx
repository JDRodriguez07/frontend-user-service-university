import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
    { to: '/students', icon: GraduationCap, label: 'Students', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
    { to: '/teachers', icon: BookOpen, label: 'Teachers', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
    { to: '/administrators', icon: Shield, label: 'Administrators', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
    { to: '/search', icon: Search, label: 'Search', roles: ['ADMIN', 'STUDENT', 'TEACHER'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">UniManager</h1>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.role} Portal
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3 px-3">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role.toLowerCase()}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              University Management System
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
