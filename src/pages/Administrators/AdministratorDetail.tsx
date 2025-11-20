import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { administratorsAPI, Administrator } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AdministratorDetail() {
  const { id } = useParams<{ id: string }>();
  const [administrator, setAdministrator] = useState<Administrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (id) {
      loadAdministrator(parseInt(id));
    }
  }, [id]);

  const loadAdministrator = async (adminId: number) => {
    try {
      setIsLoading(true);
      const data = await administratorsAPI.getById(adminId);
      setAdministrator(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load administrator',
      });
      navigate('/administrators');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!administrator || !confirm('Are you sure you want to delete this administrator?')) return;

    try {
      await administratorsAPI.delete(administrator.id);
      toast({
        title: 'Success',
        description: 'Administrator deleted successfully',
      });
      navigate('/administrators');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete administrator',
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

  if (!administrator) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/administrators')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administrator Details</h1>
              <p className="text-muted-foreground mt-1">{administrator.adminCode}</p>
            </div>
          </div>
          {isAdmin && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{administrator.name} {administrator.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Document (DNI)</p>
                <p className="font-medium">{administrator.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{administrator.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{administrator.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{administrator.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrative Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admin Code</p>
                <p className="font-medium">{administrator.adminCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <p className="font-medium">{administrator.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Position</p>
                <p className="font-medium">{administrator.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={administrator.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {administrator.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
