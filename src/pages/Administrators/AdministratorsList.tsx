import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { administratorsAPI, Administrator } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AdministratorsList() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadAdministrators();
  }, []);

  const loadAdministrators = async () => {
    try {
      setIsLoading(true);
      const data = await administratorsAPI.getAll();
      setAdministrators(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load administrators',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administrators</h1>
            <p className="text-muted-foreground mt-1">Manage administrator records</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/administrators/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Administrator
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Administrators</CardTitle>
            <CardDescription>
              {administrators.length} administrator(s) registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : administrators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No administrators found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {administrators.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.adminCode}</TableCell>
                        <TableCell>{admin.name} {admin.lastName}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.department}</TableCell>
                        <TableCell>{admin.position}</TableCell>
                        <TableCell>
                          <Badge variant={admin.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/administrators/${admin.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
