import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit {

  user:any
  constructor(  private apiService: ApiService,) { }

  ngOnInit() {
this.me()




  }

  me() {
    this.apiService.me().subscribe(response => {
      console.log('response is: ', response);
      if (response.sucess) {
        console.log(response)
        this.user=response
      } else {
       // this.alertService.alert('Warning', response.message);
       console.log(response)
      }
    }, (error) => {

      console.log(error);
    });
  }

}
