import { Component, OnInit } from "@angular/core";

declare const google: any;

interface Marker {
lat: number;
lng: number;
label?: string;
draggable?: boolean;
}

@Component({
  selector: "app-map",
  templateUrl: "map.component.html",
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

       
}
