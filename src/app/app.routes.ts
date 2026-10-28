import { Routes } from '@angular/router';
import { authGuard } from '../cores/services/auth.guard';
import { HasPermissionDirective } from '../cores/services/has-permission.directive';

export const routes: Routes = [
  // Default redirect → login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // PROTECTED LAYOUT + ALL CHILD ROUTES
  {
    path: '',
    loadComponent: () =>
      import('./layout').then((m) => m.DefaultLayoutComponent),
    canActivate: [authGuard], // 🔐 Protect EVERYTHING inside layout
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [authGuard], // Optional (already protected from parent)
      },
      {
        path: 'user',
        loadChildren: () => import('./views/user/routes').then((m) => m.routes),
      },
      {
        path: 'permission',
        loadChildren: () =>
          import('./views/permission/routes').then((m) => m.routes),
      },
      {
        path: 'role-permission',
        loadChildren: () =>
          import('./views/rolepermision/routes').then((m) => m.routes),
      },

      {
        path: 'question',
        loadChildren: () =>
          import('./views/question/routes').then((m) => m.routes),
      },

      {
        path: 'answer',
        loadChildren: () =>
          import('./views/answer/routes').then((m) => m.routes),
      },
      {
        path: 'course',
        loadChildren: () =>
          import('./views/course/routes').then((m) => m.routes),
      },
      {
        path: 'material',
        loadChildren: () =>
          import('./views/material/routes').then((m) => m.routes),
      },
      {
        path: 'coursetitle',
        loadChildren: () =>
          import('./views/coursetitle/routes').then((m) => m.routes),
      },
      {
        path: 'course-request',
        loadChildren: () =>
          import('./views/course-request/routes').then((m) => m.routes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/routes').then((m) => m.routes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/routes').then((m) => m.routes),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/routes').then((m) => m.routes),
      },
    ],
  },

  // PUBLIC ROUTES (NO AUTH REQUIRED)
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
  },

  // FALLBACK
  { path: '**', redirectTo: 'dashboard' },
];
