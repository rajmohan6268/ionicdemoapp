import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  signInForm: FormGroup;
  userdata:any = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
    this.signInForm = this.formBuilder.group({
     
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
      })
    
  }

  ngOnInit() {  


  }
  ionViewDidEnter() {
    this.userdata = JSON.parse(localStorage.getItem('userdata'))
    console.log("userdata",this.userdata)
    if(this.userdata != null){
      this.router.navigate(['/app/layout/tab1'])
    }
  }
  submitSignInForm() {
    let obj = {
      user:{
    
        email: this.signInForm.value.email, password:this.signInForm.value.password
      }
    }
    this.apiService.signIn(obj).subscribe(response => {
      console.log('response is: ', response);
      if (response.sucess) {
      //  this.authenticationService.login(response);
      localStorage.setItem("userdata",JSON.stringify(response))
      localStorage.setItem("token",response.token)
        this.alertService.alert('Login', "User Login Success");
        this.router.navigate(['/app'])
      } else {
        this.alertService.alert('Warning', response.message);
      }
    }, (error) => {
      this.signInForm.controls['password'].reset();
      console.log(error);
    });
  }

}
