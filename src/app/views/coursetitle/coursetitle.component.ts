import { Component, OnInit, Input } from '@angular/core';
import { CourseTitle } from '../../../cores/models/CourseTitle';
import { Materiial } from '../../../cores/models/Material';
import { APIServiceService } from '../../../cores/services/apiservice.service';

import {
  ModalModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
} from '@coreui/angular';
import { SafeUrlPipe } from '../../../cores/services/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ButtonDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-coursetitle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ButtonDirective,
    SafeUrlPipe,
    ModalModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  templateUrl: './coursetitle.component.html',
  styleUrls: ['./coursetitle.component.scss'],
})
export class CoursetitleComponent implements OnInit {
  @Input() courseTitles: CourseTitle[] = [];

  // Material modal
  selectedTitle: CourseTitle | null = null;
  newMaterial: Materiial = this.resetMaterial();
  showMaterialModal = false;
  selectedFile: File | null = null;

  // Preview
  previewFile: Materiial | null = null;

  readonly maxFileSize = 500 * 1024 * 1024; // 500MB

  constructor(private apiservice: APIServiceService) {}

  ngOnInit(): void {}

  // ==================== MATERIALS ====================
  openAddMaterialModal(title: CourseTitle) {
    this.selectedTitle = title;
    this.showMaterialModal = true;
    this.newMaterial = this.resetMaterial(title);
  }

  closeAddMaterialModal() {
    this.showMaterialModal = false;
    this.selectedFile = null;
  }

  resetMaterial(title?: CourseTitle): Materiial {
    return {
      materialId: '',
      courseTitleId: title?.courseTitleId ?? '',
      courseName: title?.courseName ?? '',
      titleName: title?.titleName ?? '',
      fileName: '',
      fileUrl: '',
      type: '',
    };
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.size > this.maxFileSize) {
      alert('File size exceeds 500MB limit.');
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  uploadMaterial() {
    if (!this.selectedFile || !this.selectedTitle) {
      alert('Please select a file!');
      return;
    }

    this.newMaterial.courseTitleId = this.selectedTitle.courseTitleId;
    this.newMaterial.fileName = this.selectedFile.name;

    this.apiservice
      .uploadMaterial(this.newMaterial, this.selectedFile)
      .subscribe({
        next: (res: Materiial) => {
          if (!this.selectedTitle!.materials)
            this.selectedTitle!.materials = [];

          this.selectedTitle!.materials.push(res);
          this.closeAddMaterialModal();
        },
        error: (err) => console.error('Upload failed', err),
      });
  }

  deleteMaterial(title: CourseTitle, material: Materiial) {
    if (!confirm(`Are you sure you want to delete "${material.fileName}"?`))
      return;
    this.apiservice.deleteMaterial(material.materialId).subscribe({
      next: () => {
        title.materials = title.materials.filter(
          (m) => m.materialId !== material.materialId
        );
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  // ==================== PREVIEW ====================
  openPreview(file: Materiial) {
    this.previewFile = file;
  }

  closePreview() {
    this.previewFile = null;
  }

  get previewUrl(): string {
    return this.previewFile?.fileUrl ?? '';
  }
}
