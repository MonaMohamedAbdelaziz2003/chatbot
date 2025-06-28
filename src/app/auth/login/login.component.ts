import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {



  isLoginMode = true;
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  rememberMe = false;
  showPass = false;

  constructor(private authService: ApiService,private router: Router) {}

  isLogin(): boolean {
    return this.isLoginMode;
  }

  setIsLogin(val: boolean) {
    this.isLoginMode = val;
  }

  showPassword(): boolean {
    return this.showPass;
  }

  togglePassword(_mode: string) {
    this.showPass = !this.showPass;
  }
loginErrors = {
  email: '',
  password: ''
};

registerErrors = {
  name: '',
  email: '',
  password: '',
  confirm_password: ''
};


  onSubmit() {
    if (this.isLogin()) {
      const data = {
        email: this.email,
        password: this.password,
      };
      this.authService.login(data).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          localStorage.setItem('token', res.data.token);
          this.router.navigateByUrl('home')
        },
        error: (err) => console.error('Login error', err),
      });
    }  else {
  if (this.password !== this.confirmPassword) {
    console.error('Passwords do not match');
    alert('Passwords do not match');
    return;
  }

  const data = {
    name: this.name,
    email: this.email,
    password: this.password,
    confirm_password: this.confirmPassword,
  };

  this.authService.register(data).subscribe({
    next: (res) => {
      console.log('Registration successful', res);
      this.setIsLogin(true);
    },
    error: (err) => console.error('Registration error', err),
  });
}

  }
}




