import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  showMenu = false;
  routes = [
    {
      path: '/',
      data: { icon: 'dashboard', text: 'Home' }
    },
    {
      path: 'product',
      data: { icon: 'bar_chart', text: 'Product' }
    },
    {
      path: 'category',
      data: { icon: 'article', text: 'Category' }
    },
    {
      path: 'employee',
      data: { icon: 'account_box', text: 'Employee' }
    },
    {
      path: 'contact',
      data: { icon: 'credit_card', text: 'Contact' }
    },
  ];
  constructor() {}

  ngOnInit() {}
}
