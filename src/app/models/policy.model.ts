export interface Policy {
  id?: number;
  policyNumber: string;
  holderName: string;
  type: 'Life' | 'Health' | 'Vehicle' | 'Property';
  startDate: Date;
  endDate: Date;
  premium: number;
  status?: 'Active' | 'Expired';
  createdAt?: Date;
  updatedAt?: Date;
}

