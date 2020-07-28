import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetComponent } from './components/reset/reset.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyComponent, ResetComponent],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
