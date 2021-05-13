import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ProfilesPageModule } from './pages/profiles/profiles.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ProfilesPageModule,
  ],
  providers: [    StatusBar,
    SplashScreen,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },],
  bootstrap: [AppComponent],
})
export class AppModule {}
