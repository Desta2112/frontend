// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../../cores/models/User';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { ModalComponent } from '../../SharedComponents/modal/modal.component';
import { DropdownModule } from '@coreui/angular';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-user',
  standalone: true, // <-- important
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ModalComponent,
    DropdownModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  roles: string[] = [];
  user: User = this.newUser();
  selectedUserId: string = '';
  isEditMode: boolean = false;
  message: string = '';
  showModal: boolean = false;
  showPermissionModal: boolean = false;
  userPermissions: string[] = [];
  selectedUser: User | null = null;
  isToggling = false;
  rolePermissions: string[] = [];

  constructor(private apiservice: APIServiceService) {}

  ngOnInit(): void {
    this.getUsers();
    this.loadRoles();
    // this.getAvailablePermissions();
  }

  newUser(): User {
    return {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      role: '',
      status: true,
      password: 'Eep@1234',
    };
  }

  getUsers() {
    this.apiservice.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.message = '';
      },
      error: () => {
        this.message = 'Failed to load users.';
        this.users = [];
      },
    });
  }

  loadRoles() {
    this.apiservice.getRoles().subscribe({
      next: (res) => (this.roles = res),
      error: () => (this.roles = []),
    });
  }
  openModalForCreate() {
    this.user = this.newUser();
    this.isEditMode = false;
    this.userPermissions = [];
    this.selectedUserId = '';
    this.showModal = true;
  }
  openModalForEdit(user: User) {
    this.user = { ...user };
    this.selectedUserId = user.id!;
    this.isEditMode = true;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.resetForm();
  }
  resetForm() {
    this.user = this.newUser();
    this.selectedUserId = '';
    this.isEditMode = false;
    this.userPermissions = [];
    this.selectedUser = null;
  }

  register() {
    //   if (this.isEditMode) {
    //     this.apiservice.updateUser(this.selectedUserId, this.user).subscribe({
    //       next: () => {
    //         this.message = 'User updated successfully.';
    //         this.getUsers();
    //         this.closeModal();
    //       },
    //       error: () => {
    //         this.message = 'Update failed.';
    //       },
    //     });
    //   } else {
    //     this.apiservice.registerUser(this.user).subscribe({
    //       next: () => {
    //         this.message = 'User registered successfully.';
    //         this.getUsers();
    //         this.closeModal();
    //       },
    //       error: () => {
    //         this.message = 'Registration failed.';
    //       },
    //     });
    //   }
  }
  onRoleChange() {
    if (this.user.role === 'Director') {
    }
  }
  openPermissionManager(user: User) {
    this.selectedUser = user;
    this.selectedUserId = user.id!;
    //this.getUserPermissions(this.selectedUserId);
    this.showPermissionModal = true;
  }
}
