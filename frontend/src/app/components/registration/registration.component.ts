import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  isLoading :boolean = false;
  hidePassword :boolean = true;
  uncheckedTerms :boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private notificationService:NotificationService
    ) {} 

    // perform action on singup click
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(this.uncheckedTerms){
      return;
    }
    this.createUser(form.value.email, form.value.password, form.value.name, form.value.surname, form.value.mobile); 
  }
// create user
  createUser(email: string, password: string, name: string, surname: string, mobile: number) {
    this.isLoading = true;
    const signupData = { email: email, password: password, name: name, surname: surname,cellPhone: mobile, userIdentifier:null };
    this.userService.addUser(signupData)
      .subscribe({
        next:(response) => {
          this.isLoading = false;
        this.router.navigate(['/login']);
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
  // hide show paswword
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  // terms checkbox selected
  checkCheckboxSelected(event){
    if(event.checked){
      this.uncheckedTerms = false;
    }else{
      this.uncheckedTerms = true
    }
  }
}

