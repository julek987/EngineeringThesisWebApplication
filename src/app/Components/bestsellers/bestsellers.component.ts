import {Component, OnInit} from '@angular/core';
import {Bestseller, Product} from "../../../types";
import {WarehouseService} from "../../services/Warehouse/warehouse.service";
import {ActivatedRoute} from "@angular/router";
import {BestsellersService} from "../../services/Bestsellers/bestsellers.service";

@Component({
  selector: 'app-bestsellers',
  templateUrl: './bestsellers.component.html',
  styleUrl: './bestsellers.component.css'
})
export class BestsellersComponent implements OnInit{
  products: Product[] = [];
  searchTextProducts: string = '';
  filteredProducts: Product[] = [];
  bestsellers: Bestseller[] = [];
  searchTextBestsellers: string = '';
  filteredBestsellers: Bestseller[] = [];


  constructor(
    private warehouseService: WarehouseService,
    private bestsellerService: BestsellersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProducts();
      this.loadBestsellers();
    });
  }

  loadBestsellers(): void {
    this.bestsellerService.getAllBestsellers('http://localhost:5001/getbestsellers')
      .subscribe((response: {value: Bestseller[]}) => {
        this.bestsellers = response.value;
        this.filteredBestsellers = this.bestsellers;
      })
  }

  filterBestsellers(): void {
    this.filteredBestsellers = this.bestsellers.filter(bestseller =>
      bestseller.code.toLowerCase().includes(this.searchTextBestsellers.toLowerCase())
    );
  }

  loadProducts() {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = this.groupProductsByPrefix(response.value);
        this.filteredProducts = this.products;
      });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.code.toLowerCase().includes(this.searchTextProducts.toLowerCase())
    );
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

  addButtonClicked(): void {
    const selectedProductCodes = this.filteredProducts
      .filter(product => (document.getElementById('product-' + product.code) as HTMLInputElement).checked)
      .map(product => product.code);

    selectedProductCodes.forEach(code => {
      this.bestsellerService.addNewBestseller(`http://localhost:5001/createbestseller?code=${encodeURIComponent(code)}`)
        .subscribe({
          next: response => {
            console.log(`Bestseller ${code} added successfully.`);
            this.loadBestsellers();
          },
          error: error => {
            console.error(`Error adding bestseller ${code}:`, error);
          }
        });
    });
  }
}
