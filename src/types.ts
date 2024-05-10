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
