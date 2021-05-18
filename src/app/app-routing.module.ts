import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',  loadChildren: () => import('./pages/authentication/login/login.module').then(m => m.LoginPageModule) },
  { path: 'profile', redirectTo: 'profiles', pathMatch: 'full' },

  {
    path: 'app',loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) ,
  },
  { path: 'home',  loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  
  { path: 'register',  loadChildren: () => import('./pages/authentication/register/register.module').then(m => m.RegisterPageModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
