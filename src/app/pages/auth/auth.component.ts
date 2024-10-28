import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  loading = false;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', Validators.required],
      dateCreated: new Date()
    })
  }

  onLogin(): void {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value
    this.userService.login(email, password).subscribe(

      response => {

        localStorage.setItem('token', response.token);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      err => {
        this.loading = false;
        this.error = err.error || 'Login failed';
      }
    )
  }

  onSignup() {
    this.isLoading = true
    if (this.signupForm.invalid) {
      return;
    }

    const { name, email, password, age, dateCreated } = this.signupForm.value;

    this.userService.signUp(name, email, password, age, dateCreated).subscribe(
      response => {
        this.isLoading = false
        console.log(response);
        window.location.reload();
      }
    )
  }

  
}

