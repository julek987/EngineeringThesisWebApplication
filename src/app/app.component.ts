import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "./services/warehouse.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private warehouseService: WarehouseService) { }


  ngOnInit(){
    this.warehouseService.getQuantity('http://localhost:5001/warehouse?product=ABN-3431/MOT/056&date=2023-02-12')
      .subscribe((products) => {
      console.log(products);
    });
  }
}
