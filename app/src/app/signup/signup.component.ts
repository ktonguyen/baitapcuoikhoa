import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isSubmitting: any;
  username: any;
  password: any;
  email: any;
  firstName: any;
  lastName: any;
  durationInSeconds = 5;
  constructor(private router: Router, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.isSubmitting = false;
  }

  ngOnInit() {}
  onLogin() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigate(['/login']);
  }
  onSignup() {
    
    this.isSubmitting = true;
    const self = this;
    this.apiService.post('api/Account/register', 
      {
        email: this.email,
        username: this.username,
        password: this.password,
        confirmPassword: this.password,
        FirstName: this.firstName,
        LastName: this.lastName,
        Organization: 'VNPT',
      },{}
    ).subscribe(
      data => {
        self._snackBar.open('Đăng kí thành công', '', {
          duration: 1000,
        });
        self.isSubmitting = false;
        self.apiService.post('api/Account/login', {
          username: this.username,
          password: this.password,
        }, {}).subscribe(
          dataLogin => {
            localStorage.setItem('userLogin', JSON.stringify(dataLogin));
            self.router.navigate(['/']);
          },
          errLogin => {

          }
        )
      },
      error => {
        self._snackBar.open('Đăng kí thất bại vui lòng kiểm tra lại thông tin', '', {
          duration: 1000,
        });
        self.isSubmitting = false;
      }
    )
  }


}
