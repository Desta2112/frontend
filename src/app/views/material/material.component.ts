import { Component, OnInit } from '@angular/core';
import { Materiial } from '../../../cores/models/Material';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material',
  imports: [FormsModule, CommonModule],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
})
export class MaterialComponent implements OnInit {
  materials: Materiial[] = [];
  expandedMaterialId: string | null = null;
  loading = true;
  constructor(private apiservices: APIServiceService) {}

  ngOnInit(): void {
    // this.getAllMaterials();
  }
  // getAllMaterials() {
  //   this.apiservices.getAllMaterials().subscribe((res: Materiial[]) => {
  //     this.materials = res;
  //     this.loading = false;
  //   });
}
