import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { APIServiceService } from '../../../../cores/services/apiservice.service';
import {
  ButtonDirective,
  ColComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    ChartjsComponent,
  ],
})
export class WidgetsDropdownComponent implements OnInit {
  activeUsers = 0;
  inactiveUsers = 0;
  approvedCourses = 0; // if used
  pendingCourses = 0; // if used

  constructor(private apiService: APIServiceService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  loadUserStats(): void {
    forkJoin({
      active: this.apiService.getActiveUsersCount(),
      inactive: this.apiService.getInactiveUsersCount(),
      courseStats: this.apiService.getCourseRequestStats(),
    }).subscribe({
      next: (res) => {
        this.activeUsers = res.active.activeUsers;
        this.inactiveUsers = res.inactive.inactiveUsers;
        this.approvedCourses = res.courseStats.approved;
        this.pendingCourses = res.courseStats.pending;
      },
      error: (err) => {
        console.error('Failed to load user stats', err);
      },
    });
  }
}
