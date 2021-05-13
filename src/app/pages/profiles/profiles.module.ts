import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilesPage } from './profiles.page';

import { profilesRoutes } from './profiles-routing.module';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(profilesRoutes)
  ],
  providers: [
    AuthGuardService
  ],
  declarations: [ProfilesPage]
})
export class ProfilesPageModule {}
