import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
    ) {
    this.signUpForm = this.formBuilder.group({
      user: this.formBuilder.group({
        username: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.email])],

        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],

        password: ['', Validators.compose([Validators.required])],
     //   password_confirmation: ['', Validators.compose([Validators.required])]
      }),
    });
  }

  ngOnInit() {
  }

  submitSignupForm() {
    var user=this.signUpForm.value
    this.apiService.signUp(this.signUpForm.value).subscribe(response => {
      console.log('response is: ', response);
      if (response.sucess) {
     //   this.authenticationService.login(user);
        this.apiService.signIn(user).subscribe(response => {
          console.log('response is: ', response);
          if (response.sucess) {
            this.authenticationService.login(response);
          } else {
            this.alertService.alert('Warning', response.message);
          }
        }, (error) => {
         
          console.log(error);
        });




      } else {
        this.alertService.alert('Warning', response.message);
      }
    }, (error) => {
        this.signUpForm.controls['password'].reset();
      console.log(error);
    });
  }

}
