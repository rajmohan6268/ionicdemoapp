import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'profile', redirectTo: 'profiles', pathMatch: 'full' },

  {
    path: '',loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'home',  loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'login',  loadChildren: () => import('./pages/authentication/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register',  loadChildren: () => import('./pages/authentication/register/register.module').then(m => m.RegisterPageModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
