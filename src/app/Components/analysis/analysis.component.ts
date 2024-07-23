import { Component, OnInit } from '@angular/core';
import {Bestseller, Product} from "../../../types";
import { WarehouseService } from "../../services/Warehouse/warehouse.service";
import { ActivatedRoute } from '@angular/router';
import { SalesService } from "../../services/Sales/sales.service";
import { AnalyticalService } from "../../services/Analytics/analytical.service";
import {BestsellersService} from "../../services/Bestsellers/bestsellers.service";

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTextProducts: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedProducts: string[] = [];
  today: string = '';
  analysedModels: { code: string, warehouseQuantity: number, soldUnits: number, analysisFactor: number }[] = [];
  selectedClients: { id: number, name: string }[] = [];

  bestsellers: Bestseller[] = [];
  searchTextBestsellers: string = '';
  filteredBestsellers: Bestseller[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private salesService: SalesService,
    private analyticalService: AnalyticalService,
    private bestsellerService: BestsellersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProducts();
      this.loadBestsellers();
    });
    this.setTodayDate();
  }

  setTodayDate() {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
  }

  loadBestsellers(): void {
    this.bestsellerService.getAllBestsellers('http://localhost:5001/getbestsellers')
      .subscribe((response: { value: Bestseller[] }) => {
        this.bestsellers = response.value;
        this.filteredBestsellers = this.bestsellers;
        this.loadProducts();
      });
  }

  loadProducts() {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = response.value;
        this.filteredProducts = this.groupProductsByPrefix(this.products);
      });
  }

  filterProducts(): void {
    if (this.searchTextProducts.trim() === '') {
      this.filteredProducts = this.groupProductsByPrefix(this.products);
    } else {
      this.filteredProducts = this.groupProductsByPrefix(this.products).filter(product =>
        product.code.toLowerCase().includes(this.searchTextProducts.toLowerCase())
      );
    }
  }

  groupProductsByPrefix(products: Product[]): Product[] {
    const groupedProducts: { [key: string]: Product } = {};
    products.forEach(product => {
      const parts = product.code.split('/');
      const prefix = parts.slice(0, -1).join('/'); // Extract prefix without size
      if (!groupedProducts[prefix]) {
        // If prefix not found, add it
        groupedProducts[prefix] = {
          ...product,
          code: prefix // Update code to remove size information
        };
      }
    });
    return Object.values(groupedProducts);
  }

  onProductSelect(product: string, event: any): void {
    if (event.target.checked) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    }
  }

  onSelectedClientsChange(selectedClientIds: { id: number; name: string }[]): void {
    this.selectedClients = selectedClientIds;
  }

  onSubmit(): void {
    console.log('Submit button clicked');

    this.analysedModels = [];

    // Use a sequential processing function
    const processProductsSequentially = (index: number) => {
      if (index >= this.selectedProducts.length) {
        // If all products are processed, return
        return;
      }

      const prefix = this.selectedProducts[index];

      // Filter products that start with the current prefix
      const matchingProducts = this.products.filter(p => p.code.startsWith(prefix));

      // Initialize variables to accumulate warehouseQuantity, soldUnits, and analysisFactor
      let totalWarehouseQuantity = 0;
      let totalSoldUnits = 0;
      let totalAnalysisFactor = 0;
      let count = 0;

      // Process each matching product sequentially
      const processProduct = (productIndex: number) => {
        if (productIndex >= matchingProducts.length) {
          // After processing all products for the current prefix, calculate average analysisFactor
          const averageAnalysisFactor = totalAnalysisFactor / count;

          // Push the final model for the current prefix to analysedModels
          this.analysedModels.push({
            code: prefix,
            warehouseQuantity: totalWarehouseQuantity,
            soldUnits: totalSoldUnits,
            analysisFactor: averageAnalysisFactor
          });

          // Process the next prefix recursively
          processProductsSequentially(index + 1);
          return;
        }

        const product = matchingProducts[productIndex];
        const clientsIdsBody = { clients: this.selectedClients.map(id => ({ id })) };

        // Perform API requests sequentially
        this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`).subscribe({
          next: (warehouseResponse) => {
            const warehouseQuantity = warehouseResponse.value.quantity;
            totalWarehouseQuantity += warehouseQuantity;

            this.salesService.getSalesHistory(`http://localhost:5001/sales/history?product=${product.code}&from=${this.startDate}&to=${this.endDate}`, clientsIdsBody).subscribe({
              next: (salesResponse) => {
                const soldUnits = salesResponse.value;
                const soldUnitsSum = Object.values(soldUnits).reduce((sum, value) => sum + value, 0);
                totalSoldUnits += soldUnitsSum;

                // Create body with current product code
                const productBody = { products: [{ code: product.code }] };

                // Combine clients and product body
                const SalesDynamicBody = Object.assign({}, clientsIdsBody, productBody);

                this.analyticalService.getAnalyticSalesDynamic(`http://localhost:5001/analytic?analytic=SalesDynamic&from=${this.startDate}&to=${this.endDate}`, SalesDynamicBody).subscribe({
                  next: (analysisResponse) => {
                    const analysisFactor = analysisResponse.value.value;
                    totalAnalysisFactor += analysisFactor;
                    count++;

                    // Process the next product for the current prefix recursively
                    processProduct(productIndex + 1);
                  },
                  error: (analysisErr) => {
                    console.error('Error in analytical service response', analysisErr);
                    // Handle error in analytical service response by pushing with analysisFactor 0
                    totalAnalysisFactor += 0; // Add 0 to keep count consistent
                    count++;

                    // Process the next product for the current prefix recursively
                    processProduct(productIndex + 1);
                  }
                });
              },
              error: (salesErr) => {
                console.error('Error in sales history response', salesErr);
                // Handle error in sales history response by pushing with soldUnits 0 and analysisFactor 0
                totalSoldUnits += 0; // Add 0 to keep count consistent
                totalAnalysisFactor += 0; // Add 0 to keep count consistent
                count++;

                // Process the next product for the current prefix recursively
                processProduct(productIndex + 1);
              }
            });
          },
          error: (warehouseErr) => {
            console.error('Error in warehouse quantity response', warehouseErr);
            // Handle error in warehouse quantity response by pushing with warehouseQuantity 0, soldUnits 0, and analysisFactor 0
            totalWarehouseQuantity += 0; // Add 0 to keep count consistent
            totalSoldUnits += 0; // Add 0 to keep count consistent
            totalAnalysisFactor += 0; // Add 0 to keep count consistent
            count++;

            // Process the next product for the current prefix recursively
            processProduct(productIndex + 1);
          }
        });
      };

      // Start processing the first product for the current prefix
      processProduct(0);
    };

    // Start processing the first prefix
    processProductsSequentially(0);
  }

  filterBestsellers(): void {
    this.filteredBestsellers = this.bestsellers.filter(bestseller =>
      bestseller.code.toLowerCase().includes(this.searchTextBestsellers.toLowerCase())
    );
  }
}
