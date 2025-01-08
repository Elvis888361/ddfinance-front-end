import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy, PolicyType } from '../../models/policy';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Create' }} Policy</h2>
      <form [formGroup]="policyForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="policyNumber">Policy Number</label>
          <input
            id="policyNumber"
            type="text"
            formControlName="policyNumber"
            [readonly]="isEditMode"
          >
          <div class="error" *ngIf="policyForm.get('policyNumber')?.errors?.['required'] && policyForm.get('policyNumber')?.touched">
            Policy number is required
          </div>
        </div>

        <div class="form-group">
          <label for="holderName">Holder Name</label>
          <input
            id="holderName"
            type="text"
            formControlName="holderName"
          >
          <div class="error" *ngIf="policyForm.get('holderName')?.errors?.['required'] && policyForm.get('holderName')?.touched">
            Holder name is required
          </div>
        </div>

        <div class="form-group">
          <label for="type">Type</label>
          <select id="type" formControlName="type">
            <option value="">Select Type</option>
            <option [value]="type" *ngFor="let type of policyTypes">{{ type }}</option>
          </select>
          <div class="error" *ngIf="policyForm.get('type')?.errors?.['required'] && policyForm.get('type')?.touched">
            Policy type is required
          </div>
        </div>

        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            formControlName="startDate"
          >
          <div class="error" *ngIf="policyForm.get('startDate')?.errors?.['required'] && policyForm.get('startDate')?.touched">
            Start date is required
          </div>
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            formControlName="endDate"
          >
          <div class="error" *ngIf="policyForm.get('endDate')?.errors?.['required'] && policyForm.get('endDate')?.touched">
            End date is required
          </div>
        </div>

        <div class="form-group">
          <label for="premium">Premium</label>
          <input
            id="premium"
            type="number"
            formControlName="premium"
            min="0"
            step="0.01"
          >
          <div class="error" *ngIf="policyForm.get('premium')?.errors?.['required'] && policyForm.get('premium')?.touched">
            Premium is required
          </div>
          <div class="error" *ngIf="policyForm.get('premium')?.errors?.['min']">
            Premium must be greater than 0
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary" (click)="onCancel()">Cancel</button>
          <button type="submit" [disabled]="policyForm.invalid || loading">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button[type="submit"] {
      background: var(--primary-color);
      color: white;
    }

    button.secondary {
      background: #f5f5f5;
      color: #333;
    }

    .error-message {
      margin-top: 1rem;
      padding: 1rem;
      background: #ffebee;
      color: #d32f2f;
      border-radius: 4px;
    }
  `]
})
export class PolicyFormComponent implements OnInit {
  policyForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error = '';
  policyTypes = Object.values(PolicyType);
  private id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = +params['id'];
        this.loadPolicy(this.id);
      }
    });
  }

  private initializeForm(policy?: Policy): void {
    this.policyForm = this.fb.group({
      policyNumber: [{value: policy?.policyNumber || '', disabled: this.isEditMode}, [Validators.required, Validators.pattern('^[A-Z0-9]{8,}$')]],
      holderName: [policy?.holderName || '', [Validators.required]],
      type: [policy?.type || '', [Validators.required]],
      startDate: [policy?.startDate ? this.formatDateForInput(new Date(policy.startDate)) : '', [Validators.required]],
      endDate: [policy?.endDate ? this.formatDateForInput(new Date(policy.endDate)) : '', [Validators.required]],
      premium: [policy?.premium || '', [Validators.required, Validators.min(0.01)]]
    });
  }

  private loadPolicy(id: number): void {
    this.loading = true;
    this.policyService.getPolicy(id).subscribe({
      next: (policy) => {
        this.initializeForm(policy);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading policy';
        this.loading = false;
        console.error('Error loading policy:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.policyForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.policyForm.getRawValue(); // Gets disabled fields too
    const policy: Policy = {
      ...formValue,
      id: this.id,
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: new Date(formValue.endDate).toISOString(),
      premium: Number(formValue.premium)
    };

    const request = this.isEditMode ?
      this.policyService.updatePolicy(this.id!, policy) :
      this.policyService.createPolicy(policy);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.Message) {
          this.error = err.error.Message;
        } else {
          this.error = 'An error occurred while saving the policy';
        }
        console.error('Error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}


