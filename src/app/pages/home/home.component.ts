import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentUserId: any;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    
    this.checkUserLoggedIn();
    this.getUsers();
  }

  checkUserLoggedIn() {
    this.userService.checkUserLoggedIn();
    this.currentUserId = localStorage.getItem('userId')
  }

  getUsers() {
    this.userService.getUserById(this.currentUserId).subscribe(
      res => {
        console.log(res);
        
      }
    )
  }

  logout() {
    this.userService.logout();
    this.checkUserLoggedIn();
  }
}
