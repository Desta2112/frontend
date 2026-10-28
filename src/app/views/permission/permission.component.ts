import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import {
  CardBodyComponent,
  CardComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
} from '@coreui/angular';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-permission',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    NgxPaginationModule,
  ],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss',
})
export class PermissionComponent implements OnInit {
  permissionName = '';
  permissions: string[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';
  page: number = 1; // current page for pagination
  itemsPerPage: number = 10;

  constructor(private apiservice: APIServiceService) {}
  ngOnInit(): void {
    this.getPermissions();
  }

  getPermissions() {
    this.isLoading = true;
    this.apiservice.getPermissions().subscribe(
      (data) => {
        this.permissions = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage =
          'Failed to fetch permissions. Please try again later.';
        this.isLoading = false;
      }
    );
  }
  createPermission() {
    if (!this.permissionName.trim()) return;

    this.apiservice
      .createPermission({ permissionName: this.permissionName })
      .subscribe({
        next: () => {
          this.permissionName = '';
          this.getPermissions(); // reload permission list
          // this.showPermissionModal = false;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err?.error || 'Failed to create permission.';
        },
      });
  }
  deletePermission(permissionName: string) {
    if (
      confirm(
        `Are you sure you want to delete the permission: ${permissionName}?`
      )
    ) {
      this.isLoading = true;
      this.apiservice.deletepermission(permissionName).subscribe(
        () => {
          this.getPermissions();
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage =
            'Failed to delete permission. Please try again later.';
          this.isLoading = false;
        }
      );
    }
  }
}
