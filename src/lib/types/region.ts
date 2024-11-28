export interface Region {
  id: number;
  code: string;
  name: string;
  slug: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  region: string;
  dpt_slug: string;
  region_slug: string;
  region_code: string;
}

export interface HomeData {
  region: Region[];
  departementR: Department[];
}
