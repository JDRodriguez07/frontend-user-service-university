import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { teachersAPI, Teacher } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const data = await teachersAPI.getAll();
      setTeachers(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load teachers',
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
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-muted-foreground mt-1">Manage teacher records</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/teachers/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>
              {teachers.length} teacher(s) registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No teachers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.teacherCode}</TableCell>
                        <TableCell>{teacher.name} {teacher.lastName}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.specialization}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{teacher.academicDegree}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{teacher.contractType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/teachers/${teacher.id}`)}
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
