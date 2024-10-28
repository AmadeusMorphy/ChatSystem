import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    
    this.checkUserLoggedIn();
  }

  checkUserLoggedIn() {
    const token = localStorage.getItem('token');

    if(token) {
      return;
    }else{
      this.router.navigate(['/auth']);
    }
  }

  logout() {
    this.userService.logout();
    this.checkUserLoggedIn();
  }
}
