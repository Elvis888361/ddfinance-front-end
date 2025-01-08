import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = `${environment.apiUrl}/policies`;

  constructor(private http: HttpClient) { }

  getPolicies(search?: string, type?: string, sortBy?: string): Observable<Policy[]> {
    let url = this.apiUrl;
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (sortBy) params.append('sortBy', sortBy);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<Policy[]>(url);
  }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  createPolicy(policy: Policy): Observable<Policy> {
    const { id, createdAt, updatedAt, ...policyData } = policy;
    return this.http.post<Policy>(this.apiUrl, policyData);
  }

  updatePolicy(id: number, policy: Policy): Observable<Policy> {
    const { createdAt, updatedAt, ...policyData } = policy;
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, { ...policyData, id });
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

