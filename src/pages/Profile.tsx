import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, studentsAPI, teachersAPI, UserFullResponse } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type NormalizedRole = 'ADMIN' | 'STUDENT' | 'TEACHER';

const normalizeRole = (role: string): NormalizedRole => {
  return role.startsWith('ROLE_')
    ? (role.replace('ROLE_', '') as NormalizedRole)
    : (role as NormalizedRole);
};

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [fullProfile, setFullProfile] = useState<UserFullResponse | null>(null);
  const [role, setRole] = useState<NormalizedRole | null>(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    gender: '',
    password: '',
  });

  useEffect(() => {
    if (user?.email) {
      loadProfile();
    }
  }, [user?.email]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const normalizedRole = normalizeRole(user!.role);
      setRole(normalizedRole);

      const profile = await usersAPI.getProfile();
      setFullProfile(profile);

      setFormData((prev) => ({
        ...prev,
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        gender: profile.gender || '',
      }));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentUpdate = async () => {
    if (!fullProfile) return;
    try {
      await studentsAPI.update(fullProfile.id, {
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password || undefined,
        gender: formData.gender || undefined,
      } as any);
      toast({
        title: 'Profile updated',
        description: 'Your information has been updated successfully.',
      });
      setFormData((prev) => ({ ...prev, password: '' }));
      loadProfile();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update profile',
      });
    }
  };

  const handleTeacherUpdate = async () => {
    if (!fullProfile) return;
    try {
      await teachersAPI.update(fullProfile.id, {
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password || undefined,
        gender: formData.gender || undefined,
      } as any);
      toast({
        title: 'Profile updated',
        description: 'Your information has been updated successfully.',
      });
      setFormData((prev) => ({ ...prev, password: '' }));
      loadProfile();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update profile',
      });
    }
  };

  const isMember = role === 'STUDENT' || role === 'TEACHER';

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Signed in as {user?.email} ({role})
          </p>
        </div>

        {role === 'ADMIN' && (
          <Card>
            <CardHeader>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>Admins manage all records. Use the sidebar to navigate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Role: ADMIN</Badge>
                <Badge variant="secondary">Status: ACTIVE</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {fullProfile && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your profile data</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{fullProfile.name} {fullProfile.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{fullProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Document</p>
                  <p className="font-medium">{fullProfile.documentType} {fullProfile.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gender</p>
                  <p className="font-medium">{fullProfile.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Birth Date</p>
                  <p className="font-medium">{fullProfile.birthDate ? new Date(fullProfile.birthDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{fullProfile.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{fullProfile.address}</p>
                </div>
              </CardContent>
            </Card>

            {fullProfile.studentCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>Your academic record</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Student Code</p>
                    <p className="font-medium">{fullProfile.studentCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Career</p>
                    <p className="font-medium">{fullProfile.career}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">GPA</p>
                    <p className="font-medium">{fullProfile.gpa ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Student Status</p>
                    <Badge>{fullProfile.studentStatus}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Admission Date</p>
                    <p className="font-medium">{fullProfile.admissionDate ? new Date(fullProfile.admissionDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Graduation Date</p>
                    <p className="font-medium">{fullProfile.graduationDate ? new Date(fullProfile.graduationDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {fullProfile.teacherCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Information</CardTitle>
                  <CardDescription>Your professional record</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Teacher Code</p>
                    <p className="font-medium">{fullProfile.teacherCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                    <p className="font-medium">{fullProfile.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Academic Degree</p>
                    <p className="font-medium">{fullProfile.academicDegree}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contract Type</p>
                    <Badge>{fullProfile.contractType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hire Date</p>
                    <p className="font-medium">{fullProfile.hireDate ? new Date(fullProfile.hireDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {fullProfile.adminCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Information</CardTitle>
                  <CardDescription>Your admin record</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Admin Code</p>
                    <p className="font-medium">{fullProfile.adminCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-medium">{fullProfile.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Position</p>
                    <p className="font-medium">{fullProfile.position}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(role === 'STUDENT' || role === 'TEACHER') && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit basic info</CardTitle>
                  <CardDescription>Only your contact info and password can be changed here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </CardContent>
                <div className="flex items-center gap-3 px-6 pb-6">
                  {role === 'STUDENT' && <Button onClick={handleStudentUpdate}>Save changes</Button>}
                  {role === 'TEACHER' && <Button onClick={handleTeacherUpdate}>Save changes</Button>}
                </div>
              </Card>
            )}
          </>
        )}

        {!isMember && !fullProfile && (
          <Card>
            <CardHeader>
              <CardTitle>No profile data</CardTitle>
              <CardDescription>We couldn't load your profile. Contact an administrator.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </Layout>
  );
}
