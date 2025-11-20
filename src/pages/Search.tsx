import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { usersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a search value',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await usersAPI.search(searchValue);
      setResult(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Not Found',
        description: error.message || 'No user found with that search criteria',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Search Users</h1>
          <p className="text-muted-foreground mt-1">
            Search by email, code, or document number
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
            <CardDescription>
              Enter an email address, student/teacher/admin code, or document number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder="e.g., ana@uni.com, STU-0003, or 12345678"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Search Result</CardTitle>
              <CardDescription>User information found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ID</p>
                    <p className="font-medium">{result.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{result.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Role</p>
                    <Badge>{result.role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={result.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  {result.name && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{result.name} {result.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">DNI</p>
                        <p className="font-medium">{result.dni}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-medium">{result.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="font-medium">{result.address}</p>
                      </div>
                    </>
                  )}

                  {result.studentCode && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Student Code</p>
                        <p className="font-medium">{result.studentCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Career</p>
                        <p className="font-medium">{result.career}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">GPA</p>
                        <p className="font-medium">{result.gpa}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Student Status</p>
                        <Badge>{result.studentStatus}</Badge>
                      </div>
                    </>
                  )}

                  {result.teacherCode && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Teacher Code</p>
                        <p className="font-medium">{result.teacherCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                        <p className="font-medium">{result.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Academic Degree</p>
                        <Badge>{result.academicDegree}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contract Type</p>
                        <Badge>{result.contractType}</Badge>
                      </div>
                    </>
                  )}

                  {result.adminCode && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Admin Code</p>
                        <p className="font-medium">{result.adminCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Department</p>
                        <p className="font-medium">{result.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Position</p>
                        <p className="font-medium">{result.position}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
