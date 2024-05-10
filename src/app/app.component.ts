import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "./services/warehouse.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  products: any[] = [];

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response) => {
        this.products = response.value;
        console.log(response.value);
      });
  }
}
