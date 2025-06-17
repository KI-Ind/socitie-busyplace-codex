// @ts-nocheck
export interface Company {
  siret?: string;
  name: string;
  address?: string;
  city?: string;
  department?: string;
  region?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface SearchFilters {
  region?: string;
  department?: string;
  city?: string;
  activity?: string;
}
