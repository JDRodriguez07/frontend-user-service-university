import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { usersAPI, User } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    if (id) {
      loadUser(parseInt(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      setIsLoading(true);
      const data = await usersAPI.getById(userId);
      setUser(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load user',
      });
      navigate('/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(user.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      navigate('/users');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete user',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Details</h1>
              <p className="text-muted-foreground mt-1">View user information</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/users/${user.id}/edit`)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <Badge variant="default">{user.role}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
