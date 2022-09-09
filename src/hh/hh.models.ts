export interface LogoUrls {
  original: string;
  240: string;
  90: string;
}

export interface Employer {
  id: string;
  name: string;
  url: string;
  alternate_url: string;
  logo_urls: LogoUrls;
  vacancies_url: string;
  open_vacancies: number;
}

export interface HhResponse {
  items: Employer[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
}

