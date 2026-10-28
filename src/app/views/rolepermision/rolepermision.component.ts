import { Component, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIServiceService } from '../../../cores/services/apiservice.service';
//import { HasPermissionDirective } from '../../cores/services/has-permission.directive';

@Component({
  selector: 'app-rolepermision',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    //HasPermissionDirective
  ],
  templateUrl: './rolepermision.component.html',
  styleUrl: './rolepermision.component.scss',
})
export class RolepermisionComponent {
  roles: any[] = [];
  roleName = '';
  permissionName = '';
  selectedRole = '';
  showRoleModal = false;
  showPermissionModal = false;
  showAssignModal = false;
  allPermissions: string[] = [];
  assignedPermissions: string[] = [];
  errorMessage = '';

  constructor(private apiservice: APIServiceService) {}

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }
  getRoles() {
    this.apiservice.getRoles().subscribe((data: any[]) => {
      this.roles = data.map((role) => ({
        roleName: role,
        permissions: [],
      }));

      this.roles.forEach((role) => {
        this.apiservice.getrolepermission(role.roleName).subscribe((perms) => {
          role.permissions = perms;
        });
      });
    });
  }
  getPermissions() {
    this.apiservice.getPermissions().subscribe((data) => {
      this.allPermissions = data;
    });
  }
  createRole() {
    if (!this.roleName.trim()) return;

    this.apiservice.createRole(this.roleName).subscribe({
      next: () => {
        this.roleName = '';
        this.showRoleModal = false;
        this.getRoles();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create role.';
      },
    });
  }
  deleteRole(roleName: string) {
    if (confirm(`Delete role: ${roleName}?`)) {
      this.apiservice.deleteRole(roleName).subscribe(() => {
        this.getRoles();
      });
    }
  }

  openAssignModal(role: string) {
    this.selectedRole = role;
    this.showAssignModal = true;

    this.apiservice.getrolepermission(role).subscribe((perms) => {
      this.assignedPermissions = perms;
    });
  }
  togglePermission(permission: string) {
    const index = this.assignedPermissions.indexOf(permission);
    if (index >= 0) {
      this.assignedPermissions.splice(index, 1);
    } else {
      this.assignedPermissions.push(permission);
    }
  }
  assignPermissions() {
    const dto = {
      roleName: this.selectedRole,
      permissions: this.assignedPermissions,
    };

    this.apiservice.assignPermissionsToRole(dto).subscribe(() => {
      this.showAssignModal = false;
      this.getRoles();
    });
  }
}
