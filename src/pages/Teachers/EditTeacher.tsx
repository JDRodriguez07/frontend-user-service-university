import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { teachersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function EditTeacher() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    documentType: 'CC',
    dni: '',
    name: '',
    lastName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    birthDate: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    specialization: '',
    academicDegree: 'BACHELOR' as 'BACHELOR' | 'MASTER' | 'DOCTORATE',
    contractType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR',
    hireDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const canEditAll = isAdmin;

  useEffect(() => {
    if (id) {
      loadTeacher(parseInt(id));
    }
  }, [id]);

  const loadTeacher = async (teacherId: number) => {
    try {
      setIsLoadingData(true);
      const data = await teachersAPI.getById(teacherId);
      if (isTeacher && user?.id && data.id !== user.id) {
        toast({
          variant: 'destructive',
          title: 'Access denied',
          description: 'You can only edit your own teacher profile.',
        });
        navigate('/profile', { replace: true });
        return;
      }
      setFormData({
        documentType: 'CC',
        dni: data.dni,
        name: data.name,
        lastName: data.lastName,
        gender: 'MALE',
        birthDate: '',
        phoneNumber: data.phoneNumber,
        address: data.address,
        email: data.email,
        password: '',
        status: data.status as 'ACTIVE' | 'INACTIVE',
        specialization: data.specialization,
        academicDegree: data.academicDegree as 'BACHELOR' | 'MASTER' | 'DOCTORATE',
        contractType: data.contractType as 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR',
        hireDate: data.hireDate.split('T')[0],
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load teacher',
      });
      navigate('/teachers');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = isAdmin
        ? formData
        : {
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            password: formData.password || undefined,
            gender: formData.gender,
          };
      await teachersAPI.update(parseInt(id!), payload as any);
      toast({
        title: 'Success',
        description: 'Teacher updated successfully',
      });
      navigate(`/teachers/${id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update teacher',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/teachers/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Teacher</h1>
            <p className="text-muted-foreground mt-1">Update teacher information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update teacher personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (leave empty to keep current)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update professional details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicDegree">Academic Degree *</Label>
                <Select
                  value={formData.academicDegree}
                  onValueChange={(value: any) => setFormData({ ...formData, academicDegree: value })}
                  disabled={!canEditAll}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BACHELOR">Bachelor</SelectItem>
                    <SelectItem value="MASTER">Master</SelectItem>
                    <SelectItem value="DOCTORATE">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type *</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value: any) => setFormData({ ...formData, contractType: value })}
                  disabled={!canEditAll}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACTOR">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  disabled={!canEditAll}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  disabled={!canEditAll}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Teacher'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/teachers/${id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
