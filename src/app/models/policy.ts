export interface Policy {
  id?: number;
  policyNumber: string;
  holderName: string;
  type: PolicyType;
  startDate: Date;
  endDate: Date;
  premium: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PolicyType {
  Life = 'Life',
  Health = 'Health',
  Vehicle = 'Vehicle',
  Property = 'Property'
} 