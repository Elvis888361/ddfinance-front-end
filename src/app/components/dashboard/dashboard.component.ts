import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy, PolicyType } from '../../models/policy';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="controls">
        <div class="search-filters">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearchChange()"
              placeholder="Search policies..."
              class="search-input"
            >
          </div>
          <div class="filter-group">
            <select [(ngModel)]="selectedType" (ngModelChange)="onFilterChange()" class="filter-select">
              <option value="">All Types</option>
              <option *ngFor="let type of policyTypes" [value]="type">{{type}}</option>
            </select>
            <select [(ngModel)]="sortBy" (ngModelChange)="onSortChange()" class="filter-select">
              <option value="">Sort By</option>
              <option value="date">Date</option>
              <option value="premium">Premium</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <button class="add-button" routerLink="/policies/new">
          <i class="fas fa-plus"></i> New Policy
        </button>
      </div>

      <div class="loading-message" *ngIf="loading">
        <i class="fas fa-spinner fa-spin"></i> Loading policies...
      </div>
      <div class="error-message" *ngIf="error">
        <i class="fas fa-exclamation-circle"></i> {{error}}
      </div>

      <div class="table-responsive" *ngIf="!loading && !error">
        <table class="policy-table">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Holder Name</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Premium</th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let policy of policies" class="policy-row">
              <td class="policy-number">{{policy.policyNumber}}</td>
              <td>{{policy.holderName}}</td>
              <td>
                <span class="policy-type" [class]="policy.type.toLowerCase()">
                  {{policy.type}}
                </span>
              </td>
              <td>{{policy.startDate | date:'mediumDate'}}</td>
              <td>{{policy.endDate | date:'mediumDate'}}</td>
              <td class="premium">{{policy.premium | currency}}</td>
              <td class="actions">
                <button 
                  class="action-button edit" 
                  (click)="editPolicy(policy.id!)" 
                  [disabled]="!policy.id"
                  title="Edit Policy"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="action-button delete" 
                  (click)="deletePolicy(policy.id!)" 
                  [disabled]="!policy.id"
                  title="Delete Policy"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .search-filters {
      display: flex;
      gap: 1rem;
      flex: 1;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
    }

    .filter-group {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.75rem 2rem 0.75rem 1rem;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background-color: white;
      font-size: 1rem;
      cursor: pointer;
      min-width: 150px;
    }

    .add-button {
      padding: 0.75rem 1.5rem;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background: #357abd;
    }

    .table-responsive {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .policy-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .policy-table th,
    .policy-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .policy-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      position: sticky;
      top: 0;
    }

    .policy-table tbody tr {
      transition: background-color 0.2s;
    }

    .policy-table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .policy-number {
      font-family: monospace;
      font-weight: 500;
    }

    .policy-type {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .policy-type.life {
      background: #e3f2fd;
      color: #1976d2;
    }

    .policy-type.health {
      background: #e8f5e9;
      color: #388e3c;
    }

    .policy-type.vehicle {
      background: #fff3e0;
      color: #f57c00;
    }

    .policy-type.property {
      background: #fce4ec;
      color: #c2185b;
    }

    .premium {
      font-weight: 500;
      color: #2e7d32;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .action-button {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-button.edit {
      color: #4a90e2;
    }

    .action-button.edit:hover:not(:disabled) {
      background: #e3f2fd;
    }

    .action-button.delete {
      color: #dc3545;
    }

    .action-button.delete:hover:not(:disabled) {
      background: #fce4ec;
    }

    .loading-message,
    .error-message {
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-message {
      background: #e3f2fd;
      color: #1976d2;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
    }

    @media (max-width: 1024px) {
      .search-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        flex-wrap: wrap;
      }

      .filter-select {
        flex: 1;
      }
    }

    @media (max-width: 768px) {
      .controls {
        flex-direction: column;
      }

      .add-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  policies: Policy[] = [];
  policyTypes = Object.values(PolicyType);
  loading = false;
  error = '';
  searchTerm = '';
  selectedType = '';
  sortBy = '';

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.loading = true;
    this.error = '';
    
    this.policyService.getPolicies(this.searchTerm, this.selectedType, this.sortBy)
      .subscribe({
        next: (policies) => {
          this.policies = policies;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading policies';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  editPolicy(id: number): void {
    this.router.navigate(['/policies/edit', id]);
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id).subscribe({
        next: () => {
          this.loadPolicies();
        },
        error: (err) => {
          this.error = 'Error deleting policy';
          console.error('Error:', err);
        }
      });
    }
  }

  onSearchChange(): void {
    this.loadPolicies();
  }

  onFilterChange(): void {
    this.loadPolicies();
  }

  onSortChange(): void {
    this.loadPolicies();
  }
}

