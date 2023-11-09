import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isLoading = false;
  isUserExists:boolean = true;
  emailSent: boolean = false;
  email: string;
  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService:NotificationService
    ) {} 

  onContinue(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.checkUserExists(form.value.email); 
  }

  // check if user exists with entered email
  checkUserExists(email: string) {
    this.userService.checkUserExists(email)
      .subscribe({
        next:(response) => {
          this.isLoading = false;
          if(response){
            this.isUserExists = true;
            this.sendForgotPasswordMail(email);
          }else {
            this.isUserExists = false;
          }
      },
      error:(error) =>{
        this.isLoading = false;
        if (error.status == 422) {
          this.notificationService.showMessage('error', true, `${error.error}`, '');
        } else {
          this.notificationService.showMessage('error', true, `${error.status}
      - ${error.statusText} - ${error.error}`, '');
        }
      }});
  }

  //navigate to login
  moveToLogin(){
    this.router.navigate(['/login']);
  }

  // send forgot password mail
  sendForgotPasswordMail(email: string) {
    this.isLoading = true;
    this.userService.sendForgotPasswordMail(email)
      .subscribe({
        next:(response) => {
          this.isLoading = false;
          if(response){
            this.emailSent = true;
            this.email = email;
            this.notificationService.showMessage('success', true, `Email send successfully`, '');
          }else {
            this.emailSent = false;
            this.email = null;
          }
      },
      error:(error) =>{
        this.isLoading = false;
        this.email = null;
        if (error.status == 422) {
          this.notificationService.showMessage('error', true, `${error.error}`, '');
        } else {
          this.notificationService.showMessage('error', true, `${error.status}
      - ${error.statusText} - ${error.error}`, '');
        }
      }});
  }
}
