import { Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ProfilesPage } from './profiles.page';


export const profilesRoutes: Routes = [
  {
    path: 'profiles',
    component: ProfilesPage,
    canActivate: [AuthGuardService],
    children: [

    ]
  }
];
