import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  code?: string;
  clients: string[] = [];
  clientsIds: string[] = [];
  startDate?: string;
  endDate?: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.clients = JSON.parse(params['clientsNames']);
      this.clientsIds = JSON.parse(params['clientsIds']);
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
    });
  }
}
