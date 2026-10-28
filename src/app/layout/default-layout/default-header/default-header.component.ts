import { Component, computed, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';

import { APIServiceService } from '../../../../cores/services/apiservice.service';
import { AuthService } from '../../../../cores/services/auth.service';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../SharedComponents/modal/modal.component';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ModalComponent,
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    BreadcrumbRouterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    BadgeComponent,
    DropdownDividerDirective,
  ],
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar1';

  user: any; // <-- hold current user here
  selectedUserId: string = '';
  showChangePasswordModal = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
  };

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' },
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return (
      this.colorModes.find((mode) => mode.name === currentMode)?.icon ??
      'cilSun'
    );
  });

  constructor(
    private apiservice: APIServiceService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    // Assign the logged-in user from AuthService on component init
    this.user = this.authService.getUser();
  }

  openChangePasswordModal(user: any) {
    if (!user || !user.userId) {
      alert('User not found.');
      return;
    }
    this.selectedUserId = user.userId;
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.passwordForm = { currentPassword: '', newPassword: '' };
  }

  changePassword() {
    const payload = {
      userId: this.selectedUserId,
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
    };

    this.apiservice.changePassword(payload).subscribe({
      next: () => {
        alert('Password changed successfully.');
        this.closeChangePasswordModal();
      },
      error: (err) => {
        console.error('Change password failed:', err);
        alert(err.error?.message || 'Failed to change password.');
      },
    });
  }

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      // Disable back navigation cache
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    });
  }
}
