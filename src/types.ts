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


