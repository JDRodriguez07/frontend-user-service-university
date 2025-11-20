# University Management System - Frontend Integration Guide

## 📋 Overview

This React + TypeScript frontend application is designed to consume your Java Spring Boot backend API for university user management. The application provides a complete administrative interface with role-based access control for managing users, students, teachers, and administrators.

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT with localStorage

### Project Structure

```
src/
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── Layout.tsx           # Main layout with sidebar
│   ├── ProtectedRoute.tsx   # Route authentication wrapper
│   └── NavLink.tsx          # Navigation link component
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── pages/
│   ├── Login.tsx            # Login page
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Search.tsx           # User search page
│   ├── Users/               # User CRUD pages
│   ├── Students/            # Student CRUD pages
│   ├── Teachers/            # Teacher CRUD pages
│   └── Administrators/      # Administrator CRUD pages
├── services/
│   └── api.ts               # API client and types
└── App.tsx                  # Main app with routing
```

## 🔧 Configuration

### 1. Backend URL Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:1123
```

For production, update this to your production API URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔐 Authentication Flow

### How It Works

1. **Login**: User submits credentials via `/auth/login`
2. **Token Storage**: JWT token is stored in localStorage
3. **Token Decoding**: JWT payload is decoded to extract user role and email
4. **Automatic Injection**: Token is automatically added to all API requests via `Authorization: Bearer <token>` header
5. **Auto-Redirect**: Invalid/expired tokens (401/403 responses) automatically redirect to login

### JWT Payload Expected Format

```typescript
{
  sub: string,           // User email
  role: 'ADMIN' | 'STUDENT' | 'TEACHER',
  exp: number,          // Expiration timestamp
  iat: number           // Issued at timestamp
}
```

**Important**: Make sure your backend JWT includes the `role` claim for proper role-based access control.

## 🛣️ Routes & Role-Based Access

### Public Routes
- `/auth/login` - Login page

### Protected Routes (All Authenticated Users)
- `/dashboard` - Main dashboard
- `/users` - View all users
- `/users/:id` - View user details
- `/students` - View all students
- `/students/:id` - View student details
- `/teachers` - View all teachers
- `/teachers/:id` - View teacher details
- `/administrators` - View all administrators
- `/administrators/:id` - View administrator details
- `/search` - Search users by email/code/document

### Admin-Only Routes
- `/users/create` - Create new user
- `/students/create` - Create new student
- `/students/:id/edit` - Edit student
- `/teachers/create` - Create new teacher
- `/teachers/:id/edit` - Edit teacher
- `/administrators/create` - Create new administrator
- `/administrators/:id/edit` - Edit administrator
- Delete operations for all entities

## 📡 API Integration

### API Client (`src/services/api.ts`)

The API client provides:

- Automatic JWT token injection
- Centralized error handling
- Type-safe request/response interfaces
- Automatic 401/403 handling with redirect to login

### Example API Usage

```typescript
import { studentsAPI } from '@/services/api';

// Get all students
const students = await studentsAPI.getAll();

// Get student by ID
const student = await studentsAPI.getById(5);

// Create student
const newStudent = await studentsAPI.create({
  documentType: 'CC',
  dni: '12345678',
  name: 'Ana',
  lastName: 'Rojas',
  // ... other fields
});

// Update student
await studentsAPI.update(5, { gpa: 4.5 });

// Delete student
await studentsAPI.delete(5);
```

### Endpoint Mapping

| Frontend Function | HTTP Method | Backend Endpoint | Auth Required |
|------------------|-------------|------------------|---------------|
| `authAPI.login()` | POST | `/auth/login` | No |
| `usersAPI.getAll()` | GET | `/users` | Yes |
| `usersAPI.getById()` | GET | `/users/:id` | Yes |
| `usersAPI.create()` | POST | `/users` | Yes |
| `usersAPI.update()` | PUT | `/users/:id` | Yes |
| `usersAPI.delete()` | DELETE | `/users/:id` | Yes |
| `usersAPI.search()` | GET | `/users/search?value=` | Yes |
| `studentsAPI.*` | Various | `/students/*` | Yes |
| `teachersAPI.*` | Various | `/teachers/*` | Yes |
| `administratorsAPI.*` | Various | `/administrators/*` | Yes |

## ⚙️ Important Backend Requirements

### 1. CORS Configuration

Your Spring Boot backend must allow requests from the frontend origin:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080") // Frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. JWT Configuration

Ensure your JWT includes the `role` claim:

```java
String token = Jwts.builder()
    .setSubject(user.getEmail())
    .claim("role", user.getRole().name())  // CRITICAL!
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
    .compact();
```

### 3. Error Response Format

For consistent error handling, return errors in this format:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-20T10:00:00"
}
```

### 4. Response Status Codes

Use standard HTTP status codes:
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)
- `500 Internal Server Error` - Server errors

## 🎨 UI Features

### Design System
- Professional blue and green color scheme
- Responsive design (mobile, tablet, desktop)
- Dark mode ready (can be enabled)
- Smooth animations and transitions
- Accessible components (ARIA compliant)

### Key UI Components
- **Sidebar Navigation**: Collapsible sidebar with role-based menu items
- **Data Tables**: Sortable, searchable tables with pagination
- **Forms**: Multi-step forms with validation
- **Modals**: Confirmation dialogs for destructive actions
- **Toasts**: Non-intrusive notifications for user feedback
- **Loading States**: Skeleton screens and spinners
- **Error States**: Friendly error messages with retry options

## 🔄 State Management

### React Query Features
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Automatic retry on failure

### Authentication State
- Global auth context via React Context API
- Persistent login via localStorage
- Automatic token validation on app load
- Role-based UI rendering

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Environment Variables for Production

Update `.env` or use environment-specific files:

```env
VITE_API_BASE_URL=https://api.university.com
```

### Hosting Options

The built application is a static SPA and can be hosted on:
- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy SPA routing configuration
- **AWS S3 + CloudFront**: Scalable static hosting
- **Nginx**: Traditional server deployment
- **Docker**: Container-based deployment

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name university-admin.com;
    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:1123;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 Debugging & Development

### Browser DevTools

1. **Network Tab**: Monitor API requests and responses
2. **React DevTools**: Inspect component state and props
3. **Redux DevTools**: (if using Redux instead of Context)

### Common Issues

#### 1. CORS Errors
**Problem**: Browser blocks API requests
**Solution**: Configure CORS on backend (see Backend Requirements)

#### 2. 401 Unauthorized
**Problem**: Token not being sent or expired
**Solution**: Check localStorage for token, verify JWT expiration

#### 3. Role-Based Access Not Working
**Problem**: User can't access admin features
**Solution**: Verify JWT includes `role` claim and matches expected format

#### 4. API Request Failing
**Problem**: Network errors or 500 responses
**Solution**: Check `VITE_API_BASE_URL` in `.env` and backend server status

## 📝 Customization

### Adding New Endpoints

1. **Update Types** in `src/services/api.ts`:
```typescript
export interface NewEntity {
  id: number;
  name: string;
  // ... other fields
}
```

2. **Add API Functions**:
```typescript
export const newEntityAPI = {
  getAll: async (): Promise<NewEntity[]> => {
    const response = await fetchWithAuth('/new-entities');
    return response.json();
  },
  // ... other CRUD operations
};
```

3. **Create Pages** in `src/pages/NewEntity/`

4. **Add Routes** in `src/App.tsx`

### Customizing UI Theme

Edit `src/index.css` to change colors:

```css
:root {
  --primary: 217 91% 60%;      /* Your brand color */
  --accent: 142 76% 36%;       /* Secondary color */
  /* ... other variables */
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Support & Contributions

For issues or questions about integration:
1. Check the console for error messages
2. Verify backend API responses using tools like Postman
3. Review the browser Network tab for failed requests
4. Check that JWT token format matches expectations

## ✅ Integration Checklist

Before going live, verify:

- [ ] Backend CORS configured for frontend origin
- [ ] JWT includes `role` claim
- [ ] All endpoints return proper status codes
- [ ] Error responses follow consistent format
- [ ] `.env` file configured with correct API URL
- [ ] Test all CRUD operations for each entity
- [ ] Test role-based access control
- [ ] Test authentication flow (login/logout)
- [ ] Verify search functionality
- [ ] Test on multiple browsers
- [ ] Test responsive design on mobile/tablet
- [ ] Production build tested
- [ ] SSL certificate configured (for production)

---

**Built with ❤️ for university management**
