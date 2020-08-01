import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularMaterialModule } from './angular-material.module';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { ProfileDialogComponent } from './dialogs/profile-dialog/profile-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { ScannerComponent } from './dialogs/scanner/scanner.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ImagePreloadDirective,
    LoginDialogComponent,
    ProfileDialogComponent,
    ScannerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Main Angular fire module
    AngularFireDatabaseModule, // Firebase database module
    AngularMaterialModule,
    SnotifyModule,
    SharedModule,
    NgQrScannerModule,
  ],
  entryComponents: [LoginDialogComponent, ProfileDialogComponent, ScannerComponent],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true, disableClose: true },
    },
    SnotifyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
