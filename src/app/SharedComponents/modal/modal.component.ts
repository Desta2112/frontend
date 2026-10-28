import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="modal fade"
      tabindex="-1"
      role="dialog"
      [ngClass]="{ show: showModal }"
      style="display: block;"
      *ngIf="showModal"
    >
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="text-center modal-title">{{ title }}</h3>

            <ng-content select="[close-button]"></ng-content>
          </div>
          <div class="modal-body">
            <ng-content select="[modal-body]"></ng-content>
          </div>
          <div class="modal-header">
            <ng-content select="[modal-header]"></ng-content>
          </div>
          <div class="modal-footer">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" *ngIf="showModal"></div>
  `,
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string = 'Modal Title';
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.showModal = false;
    this.closeModal.emit();
  }
}
