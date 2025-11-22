import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UsersList from "./pages/Users/UsersList";
import UserDetail from "./pages/Users/UserDetail";
import CreateUser from "./pages/Users/CreateUser";
import EditUser from "./pages/Users/EditUser";
import StudentsList from "./pages/Students/StudentsList";
import StudentDetail from "./pages/Students/StudentDetail";
import CreateStudent from "./pages/Students/CreateStudent";
import EditStudent from "./pages/Students/EditStudent";
import TeachersList from "./pages/Teachers/TeachersList";
import TeacherDetail from "./pages/Teachers/TeacherDetail";
import CreateTeacher from "./pages/Teachers/CreateTeacher";
import EditTeacher from "./pages/Teachers/EditTeacher";
import AdministratorsList from "./pages/Administrators/AdministratorsList";
import AdministratorDetail from "./pages/Administrators/AdministratorDetail";
import CreateAdministrator from "./pages/Administrators/CreateAdministrator";
import EditAdministrator from "./pages/Administrators/EditAdministrator";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersList /></ProtectedRoute>} />
            <Route path="/users/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateUser /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserDetail /></ProtectedRoute>} />
            <Route path="/users/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditUser /></ProtectedRoute>} />
            
            <Route path="/students" element={<ProtectedRoute allowedRoles={['ADMIN']}><StudentsList /></ProtectedRoute>} />
            <Route path="/students/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateStudent /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><StudentDetail /></ProtectedRoute>} />
            <Route path="/students/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><EditStudent /></ProtectedRoute>} />
            
            <Route path="/teachers" element={<ProtectedRoute allowedRoles={['ADMIN']}><TeachersList /></ProtectedRoute>} />
            <Route path="/teachers/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateTeacher /></ProtectedRoute>} />
            <Route path="/teachers/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><TeacherDetail /></ProtectedRoute>} />
            <Route path="/teachers/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><EditTeacher /></ProtectedRoute>} />
            
            <Route path="/administrators" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdministratorsList /></ProtectedRoute>} />
            <Route path="/administrators/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateAdministrator /></ProtectedRoute>} />
            <Route path="/administrators/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdministratorDetail /></ProtectedRoute>} />
            <Route path="/administrators/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditAdministrator /></ProtectedRoute>} />
            
            <Route path="/search" element={<ProtectedRoute allowedRoles={['ADMIN']}><Search /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
