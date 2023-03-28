import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    rtlTitle: "لوحة القيادة",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/icons",
    title: "product backlog",
    rtlTitle: "مهام المنتج",
    icon: "icon-tablet-2",
    class: ""
  },
  {
    path: "/maps",
    title: "sprint backlog",
    rtlTitle: "مهام سبرنت",
    icon: "icon-tie-bow",
    class: "" },
  {
    path: "/scrumBoard",
    title: "scrum board",
    rtlTitle: "لوحة السكروم",
    icon: "icon-pin",
    class: ""
  },

  {
    path: "/user",
    title: "visio conférence",
    rtlTitle: "مؤتمر عبر الفيديو",
    icon: "icon-video-66",
    class: ""
  },
  {
    path: "/tables",
    title: "liste des ressources",
    rtlTitle: "الموارد المشترك ",
    icon: "icon-puzzle-10",
    class: ""
  },
  {
    path: "/typography",
    title: "Typography",
    rtlTitle: "طباعة",
    icon: "icon-align-center",
    class: ""
  },
  {
    path: "/rtl",
    title: "RTL Support",
    rtlTitle: "ار تي ال",
    icon: "icon-world",
    class: ""
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
