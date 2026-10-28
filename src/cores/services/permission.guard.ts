// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable({ providedIn: 'root' })
// export class PermissionGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     const requiredPermission = route.data['permission'] as string;
//     if (!requiredPermission) {
//       // No permission required, allow access
//       return true;
//     }

//     if (!this.authService.isAuthenticated()) {
//       // Not logged in
//       this.router.navigate(['/login']);
//       return false;
//     }

//     if (this.authService.hasPermission(requiredPermission)) {
//       return true;
//     } else {
//       // No permission -> redirect to a 403 or any other page
//       this.router.navigate(['/403']);
//       return false;
//     }
//   }
// }
