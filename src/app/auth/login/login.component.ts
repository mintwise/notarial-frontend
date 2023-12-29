import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  ngOnInit(): void {
    localStorage.setItem('nombre','');
    localStorage.setItem('correo','');
    localStorage.setItem('rol','');
  }
  public loginForm = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required ]],
  });

  constructor( private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
    ) {}

    login(){
      let body = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      }
      this.authService.login(body).subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/documents')
        } else {
          console.error('Login fallido');

        }
      });

    }


}

