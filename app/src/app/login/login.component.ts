import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isSubmitting: any;
  username: any;
  password: any;
  constructor(private router: Router, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.isSubmitting = false;
  }

  ngOnInit() {}
  onLogin() {
    const self = this;
    self.isSubmitting = false;
    self.apiService.post('api/Account/login', {
      username: this.username,
      password: this.password,
    }).subscribe(
      dataLogin => {
        localStorage.setItem('userLogin', JSON.stringify(dataLogin));
        self.router.navigate(['/']);
      },
      errLogin => {
        self._snackBar.open('Đăng nhập thất bại vui lòng kiểm tra lại thông tin', '', {
          duration: 1000,
        });
      }
    )
    this.router.navigate(['/']);
  }
  onSignup() {
    this.router.navigate(['/signup']);
  }

}
