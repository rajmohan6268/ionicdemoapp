import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userdata:any = null;
  constructor(private router:Router) {}

  ionViewDidEnter() {
    this.userdata = JSON.parse(localStorage.getItem('userdata'))
    console.log("userdata",this.userdata)
    if(this.userdata == null){
      this.router.navigate(['/'])
    }
  }
}
