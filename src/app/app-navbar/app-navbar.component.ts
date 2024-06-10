import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatMenuModule],
})
export class AppNavbarComponent implements OnInit {

  constructor(
    public router: Router
  ) {}
  ngOnInit(): void {
  }

public moviesPage(): void{
  this.router.navigate(['movies']);
}

public profilePage(): void{
  this.router.navigate(['profile']);
}

public userLogout(): void{
  localStorage.clear();
  this.router.navigate(['welcome'])
}
    
}
