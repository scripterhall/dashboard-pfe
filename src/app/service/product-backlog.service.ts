import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductBacklog } from '../model/product-backlog';
const url1 = "http://localhost:9999/gestion-product-backlog/productBacklogs"

@Injectable({
  providedIn: 'root'
})
export class ProductBacklogService {
  constructor(private http: HttpClient) { }

  public getProductBacklogById(productBacklogId:number){
    return this.http.get<ProductBacklog[]>(`${url1}/`+productBacklogId);
  }
}
