import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { studentsAPI, Student } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    if (id) {
      loadStudent(parseInt(id));
    }
  }, [id]);

  const loadStudent = async (studentId: number) => {
    try {
      setIsLoading(true);
      const data = await studentsAPI.getById(studentId);

      if (isStudent && user?.id && data.id !== user.id) {
        toast({
          variant: 'destructive',
          title: 'Access denied',
          description: 'You can only view your own student record.',
        });
        navigate('/profile', { replace: true });
        return;
      }

      setStudent(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load student',
      });
      navigate(isAdmin ? '/students' : '/profile', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student || !confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentsAPI.delete(student.id);
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
      navigate('/students');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete student',
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

  if (!student) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Details</h1>
              <p className="text-muted-foreground mt-1">{student.studentCode}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/students/${student.id}/edit`)}>
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{student.name} {student.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Document (DNI)</p>
                <p className="font-medium">{student.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{student.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Student Code</p>
                <p className="font-medium">{student.studentCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Career</p>
                <p className="font-medium">{student.career}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">GPA</p>
                <p className="font-medium">{student.gpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Student Status</p>
                <Badge>{student.studentStatus}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admission Date</p>
                <p className="font-medium">{new Date(student.admissionDate).toLocaleDateString()}</p>
              </div>
              {student.graduationDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Graduation Date</p>
                  <p className="font-medium">{new Date(student.graduationDate).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
