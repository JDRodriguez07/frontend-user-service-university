import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, Shield, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const adminStats = [
    {
      title: 'Users',
      description: 'Manage all users',
      icon: Users,
      value: 'View',
      onClick: () => navigate('/users'),
      color: 'text-primary',
    },
    {
      title: 'Students',
      description: 'Student records',
      icon: GraduationCap,
      value: 'View',
      onClick: () => navigate('/students'),
      color: 'text-accent',
    },
    {
      title: 'Teachers',
      description: 'Faculty management',
      icon: BookOpen,
      value: 'View',
      onClick: () => navigate('/teachers'),
      color: 'text-warning',
    },
    {
      title: 'Administrators',
      description: 'Admin personnel',
      icon: Shield,
      value: 'View',
      onClick: () => navigate('/administrators'),
      color: 'text-destructive',
    },
  ];

  const memberStats = [
    {
      title: 'My Profile',
      description: 'View and edit your information',
      icon: UserRound,
      value: 'Open',
      onClick: () => navigate('/profile'),
      color: 'text-primary',
    },
  ];

  const stats = isAdmin ? adminStats : memberStats;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            You're logged in as <span className="font-medium text-foreground capitalize">{user?.role?.toLowerCase()}</span>
          </p>
        </div>

        <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{stat.description}</CardDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={stat.onClick}
                >
                  {stat.value}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAdmin ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/search')}
                >
                  Search for users, students, or teachers
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/students/create')}
                >
                  Add new student
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/teachers/create')}
                >
                  Add new teacher
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                Go to my profile
              </Button>
            )}
          </CardContent>
        </Card>

        {!isAdmin && (
          <Card className="bg-muted/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Limited Access</CardTitle>
              <CardDescription>
                Some features require administrator privileges. Contact your system administrator for more access.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </Layout>
  );
}
