//based on role permission and user permission
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';
  // private apiUrl = 'http://10.24.22.54:5001/api';

  constructor(private http: HttpClient) {}

  // Login method: handles JWT, roles, and permissions
  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/login`, { userName: username, password })
      .pipe(
        switchMap((res: any) => {
          // Ensure userId exists
          if (!res.userId) {
            res.userId = res.id || null;
          }

          // Store basic login info
          localStorage.setItem('user', JSON.stringify(res));

          // Fetch role + user permissions
          if (res.userId) {
            return this.http
              .get(
                `${this.apiUrl}/UserPermission/all-permissions/${res.userId}`
              )
              .pipe(
                tap((perms: any) => {
                  const allPermissions = [
                    ...(perms.rolePermissions || []),
                    ...(perms.userPermissions || []),
                  ];
                  // Merge and remove duplicates
                  const user = this.getUser();
                  user.permissions = Array.from(new Set(allPermissions));
                  localStorage.setItem('user', JSON.stringify(user));
                }),
                switchMap(() => of(res))
              );
          }

          return of(res);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.setItem('logout', Date.now().toString()); // cross-tab logout
  }
  getUser(): any {
    const user = localStorage.getItem('user');
    if (!user) return null;
    const u = JSON.parse(user);
    return {
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      userId: u.userId || u.id || '',
      userName: u.userName || u.email || 'Unknown',
      email: u.email || '',
      roles: u.roles || [],
      permissions: u.permissions || [],
      token: u.token || '',
    };
  }

  getToken(): string | null {
    const user = this.getUser();
    return user?.token || null;
  }

  getUserRoles(): string[] {
    const user = this.getUser();
    return user?.roles || [];
  }

  getUserPermissions(): string[] {
    const user = this.getUser();
    return user?.permissions || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  }

  // isAuthenticated(): boolean {
  //   return !!this.getUser();
  // }
  isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user?.token; // ensures only users with a token are considered logged in
  }
}
