// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { APIServiceService } from '../../cores/services/apiservice.service';

// @Component({
//   selector: 'app-role',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './role.component.html',
//   styleUrls: ['./role.component.scss'] // ✅ spelling fixed from styleUrl to styleUrls
// })
// export class RoleComponent {
//   roleName = '';
//   roles: string[] = [];

//   constructor(private apiservice: APIServiceService) {
//   }
// ngOnInit(): void {
//     this.getRoles();
//   }
//   createRole() {
//     this.apiservice.createRole(`"${this.roleName}"`).subscribe(() => {
//       this.roleName = '';
//       this.getRoles();
//     });
//   }

//   getRoles() {
//     this.apiservice.getRoles().subscribe(data => this.roles = data);
//   }
// }
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { APIServiceService } from '../../cores/services/apiservice.service';

// @Component({
//   selector: 'app-role',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './role.component.html',
//   styleUrls: ['./role.component.scss']
// })
// export class RoleComponent {
//   roleName = '';
//   roles: string[] = [];

//   constructor(private apiservice: APIServiceService) {}

//   ngOnInit(): void {
//     this.getRoles();
//   }

//   createRole() {
//     if (!this.roleName.trim()) return;

//     this.apiservice.createRole(`"${this.roleName}"`).subscribe(() => {
//       this.roleName = '';
//       this.getRoles();
//     });
//   }

//   getRoles() {
//     this.apiservice.getRoles().subscribe(data => this.roles = data);
//   }

//   deleteRole(roleName: string) {
//     if (confirm(`Are you sure you want to delete the role: ${roleName}?`)) {
//       this.apiservice.deleteRole(roleName).subscribe(() => {
//         this.getRoles(); // Refresh the list after deletion
//       }, error => {
//         console.error('Error deleting role', error);
//         alert('Failed to delete role');
//       });
//     }
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {
  roleName = '';
  roles: any[] = []; // Array to store roles with permissions
  showForm = false; // Toggle form visibility
  isLoading = false; // To handle loading state
  errorMessage = ''; // To show error messages

  constructor(private apiservice: APIServiceService) {}

  ngOnInit(): void {
    this.getRoles(); // Fetch roles and permissions on component initialization
  }

  createRole() {
    if (!this.roleName.trim()) return;

    this.isLoading = true;
    this.apiservice.createRole(this.roleName).subscribe(
      (response) => {
        console.log(response.message); // ✅ Expect JSON response
        this.roleName = '';
        this.getRoles();
        this.showForm = false;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error.error.message || 'Failed to create role.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  // Function to get the list of roles with permissions
  getRoles() {
    this.isLoading = true; // Start loading
    this.apiservice.getRoles().subscribe(
      (data: any[]) => {
        // Add permissions for each role
        this.roles = data.map((role) => ({
          roleName: role,
          permissions: [], // Initialize empty permissions array
        }));

        // Fetch permissions for each role
        this.roles.forEach((role) => {
          this.apiservice
            .getrolepermission(role.roleName)
            .subscribe((permissions) => {
              role.permissions = permissions;
              this.isLoading = false; // Stop loading after all permissions are fetched
            });
        });
      },
      (error) => {
        this.errorMessage = 'Failed to fetch roles. Please try again later.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  // Function to delete a role
  deleteRole(roleName: string) {
    if (!roleName) return;

    if (confirm(`Are you sure you want to delete the role: ${roleName}?`)) {
      this.isLoading = true; // show loading indicator
      this.errorMessage = '';

      this.apiservice.deleteRole(roleName).subscribe({
        next: () => {
          this.getRoles(); // refresh roles list
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message ||
            'Failed to delete role. Please try again later.';
          this.isLoading = false;
          console.error('Delete role error:', err);
        },
      });
    }
  }
}
