import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  ngOnInit() {}

  toggleSidebar() {
    this.sideNavToggled.emit();
  }
  getUser(){
    var user = JSON.parse(localStorage.getItem('userLogin'));
    //console.log(user.object.userName);
    return user.object.userName;
  }

  onLoggedout() {
    localStorage.removeItem('userLogin');
    this.router.navigate(['/login']);
  }
}
