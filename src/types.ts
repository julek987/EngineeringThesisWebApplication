export interface Product {
  code: string;
  description: string | null;
}

export interface AllProductsResponse{
  value: Product[];
  formatters: [] | null;
  contentTypes: [] | null;
  declaredType: string | null;
  statusCode: number | null;
}
export interface Bestseller {
  code: string;
}

export interface AllBestsellersResponse{
  value: Bestseller[];
  formatters: [] | null;
  contentTypes: [] | null;
  declaredType: string | null;
  statusCode: number | null;
}


export interface Client{
  id: number;
  name: string;
}

export interface AllClientsResponse {
  value: Client[];
  formatters: [] | null;
  contentTypes: [] | null;
  declaredType: string | null;
  statusCode: number | null;
}

export interface WarehouseQuantityResponse {
  contentType: any;
  serializerSettings: any;
  statusCode: any;
  value: {
    quantity: number;
  };
}

export interface SalesHistoryResponse {
  contentType: string | null;
  serializerSettings: string | null;
  statusCode: number | null;
  value: Record<string, number>;
}

export interface Alert {
  name: string;
  products: Product[];
  clients: Client[];
  analysisPeriod: string;
  leadTime: string;
  criticalQuantity: number;
  selected?: boolean;
}

export interface AllAlertsResponse {
  value: Alert[];
  formatters: [] | null;
  contentTypes: [] | null;
  declaredType: string | null;
  statusCode: number | null;
}

export interface SalesDynamicResponse {
  contentType: string | null;
  serializerSettings: string | null;
  statusCode: number | null;
  value: {
    value: number;
    name: string;
  };
}

export interface LoginResponse {
    token: string
}

export interface Employee{
  id: number;
  username: string;
  password: string;
  role: string;
  selected?: boolean;
}

export interface EmployeesResponse{
  Employees: Employee[];
}

export interface WarehouseQuantityHistoryResponse {
  value: {
    [date: string]: number;
  };
}

export interface CheckAlertsResponse {
  value: {
    flaggedProducts: FlaggedProduct[];
  };
  formatters: any[];
  contentTypes: any[];
  declaredType: any;
  statusCode: number;
}

export interface FlaggedProduct {
  code: string;
  description: string | null;
}
