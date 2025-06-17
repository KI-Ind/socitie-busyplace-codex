// @ts-nocheck
export interface Region {
  name: string;
  count?: string;
  companiesCount?: number;
  slug?: string;
}

export interface Department {
  code: string;
  name: string;
  region: string;
  dpt_slug: string;
  region_slug: string;
  region_code: string;
  companiesCount?: number;
}

export interface HomeData {
  regions: Region[];
  departments: Department[];
}
