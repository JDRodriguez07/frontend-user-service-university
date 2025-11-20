import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { teachersAPI, Teacher } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (id) {
      loadTeacher(parseInt(id));
    }
  }, [id]);

  const loadTeacher = async (teacherId: number) => {
    try {
      setIsLoading(true);
      const data = await teachersAPI.getById(teacherId);
      setTeacher(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load teacher',
      });
      navigate('/teachers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!teacher || !confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await teachersAPI.delete(teacher.id);
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully',
      });
      navigate('/teachers');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete teacher',
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

  if (!teacher) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/teachers')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Teacher Details</h1>
              <p className="text-muted-foreground mt-1">{teacher.teacherCode}</p>
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
                <p className="font-medium">{teacher.name} {teacher.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Document (DNI)</p>
                <p className="font-medium">{teacher.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{teacher.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{teacher.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{teacher.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teacher Code</p>
                <p className="font-medium">{teacher.teacherCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                <p className="font-medium">{teacher.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Academic Degree</p>
                <Badge variant="outline">{teacher.academicDegree}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contract Type</p>
                <Badge>{teacher.contractType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hire Date</p>
                <p className="font-medium">{new Date(teacher.hireDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={teacher.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {teacher.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
