import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
    isLoading = false;
    userIdentifier: string;
    user : User;
    editEmailDialog:boolean = false;
    editNameDialog:boolean = false;
    editSurnameDialog:boolean = false;
    editPhoneDialog:boolean = false;
    changePasswordDialog:boolean = false;
    emailForm: FormGroup;
    nameForm: FormGroup;
    surnameForm: FormGroup;
    phoneForm: FormGroup;
    changePasswordForm: FormGroup;
    editedEmail: string;
    editedName: string;
    editedSurname: string;
    editedPassword: string;
    editedConfirmPassword: string;
    enteredCurrentPassword: string;
    editedPhone: number;
    isSameEmail: boolean = false;
    hidePassword: boolean = true;
    hideCurrentPassword: boolean = true;
    hideNewPassword: boolean = true;
    hideConfirmPassword: boolean = true;
    message: string = null;
    error: boolean = false;
    constructor(private authService: AuthService, private notificationService: NotificationService,private router: Router,
      private userService:UserService, private fb: FormBuilder) { }
  
      ngOnInit(){
        this.userIdentifier = localStorage.getItem('userIdentifier');
    this.getUser();
    this.createForm();
  }
  // get user details by userid
    getUser(){
      this.isLoading = true; 
      this.userService.getUserById(this.userIdentifier).subscribe({
        next:(response) => {
          this.isLoading = false;
          this.user = response;
          this.setEditValues();
        }, error:(error) =>{
          this.isLoading = false;
          if (error.status == 422) {
            this.notificationService.showMessage('error', true, `${error.error}`, '');
          } else {
            this.notificationService.showMessage('error', true, `${error.status}
        - ${error.statusText} - ${error.error}`, '');
          }      
        }
      })
    
    }
  
    createForm() {
      this.emailForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern('^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$')]]
      });
      this.nameForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(3)]]
      });
      this.surnameForm = this.fb.group({
        surname: ['', [Validators.required,Validators.maxLength(16), Validators.minLength(3) ]]
      });
      this.changePasswordForm = this.fb.group({
        password: ['', [Validators.required,Validators.maxLength(64), Validators.minLength(8) ]],
        confirmPassword: ['', [Validators.required,Validators.maxLength(64), Validators.minLength(8) ]]
      });
      this.phoneForm = this.fb.group({
        cellPhone: ['', [Validators.required,Validators.maxLength(9), Validators.minLength(9) ]]
      })
    }
  
    closeDialog(){
      this.editEmailDialog = false;
      this.editNameDialog = false;
      this.editSurnameDialog = false;
      this.changePasswordDialog = false;
      this.editPhoneDialog = false;
      this.isSameEmail = false;
      this.editedEmail = null;
      this.editedSurname = null;
      this.editedName = null;
      this.editedPassword = null;
      this.enteredCurrentPassword = null;
      this.editedPhone = null;
      this.error = false;
      this.createForm();
    }
    // update email
    updateEmail(){
      if(!this.editedEmail){
        this.notificationService.showMessage('error', true, `Please enter valid email`, '');
        return;
      }
      this.user.email = this.editedEmail;
      this.userService.updateUserEmail(this.userIdentifier, this.user).subscribe({
        next:(response) => {
          this.user = response;
          this.setEditValues();
          this.isLoading = false;
          this.closeDialog();
          this.notificationService.showSuccess(`Email updated successfully`) 
        }, error:(error) =>{
          this.isLoading = false; 
          if (error.status == 422) {
            this.notificationService.showMessage('error', true, `${error.error}`, '');
          } else {
            this.notificationService.showMessage('error', true, `${error.status}
        - ${error.statusText} - ${error.error}`, '');
          }      
        }
      })
    }
  // update name
    updateName(){
      if(!this.editedName){
        this.notificationService.showMessage('error', true, `Please enter valid name`, '');
        return;
      }
      this.user.name = this.editedName;
      this.updateUser('Name');
    }
  // update surname
    updateSurname(){
      if(!this.editedSurname){
        this.notificationService.showMessage('error', true, `Please enter valid surname`, '');
        return;
      }
      this.user.surname = this.editedSurname;
      this.updateUser('Surname');
    }
  // update user details 
    updateUser(type){
      this.isLoading = true; 
      this.userService.updateUser(this.userIdentifier, this.user).subscribe({
        next:(response) => {
          this.user = response;
          this.setEditValues();
          this.isLoading = false;
          this.closeDialog();
          this.notificationService.showSuccess(`${type} updated successfully`) 
        }, error:(error) =>{
          this.isLoading = false; 
          if (error.status == 422) {
            this.notificationService.showMessage('error', true, `${error.error}`, '');
          } else {
            this.notificationService.showMessage('error', true, `${error.status}
        - ${error.statusText} - ${error.error}`, '');
          }      
        }
      })
    }
    togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword;
    }
    toggleCurrentPasswordVisibility() {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    }
    toggleNewPasswordVisibility() {
      this.hideNewPassword = !this.hideNewPassword;
    }
    toggleConfirmPasswordVisibility() {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
    // change password
    changePassword(){
      if(this.enteredCurrentPassword.toLowerCase() != this.user.password.toLowerCase()){
        this.error = true;
        this.message = 'Current password does not match with the password in records - please check password and try again';
        return;
      }
      if(this.editedPassword.toLowerCase() != this.editedConfirmPassword.toLowerCase()){
        this.error = true;
        this.message = 'Password and Confirm Password must match';
        return;
      }
      this.isLoading = true; 
      this.user.password = this.editedPassword;
      this.userService.changePassword(this.userIdentifier, this.user).subscribe({
        next:(response) => {
          this.user = response;
          this.isLoading = false;
          this.closeDialog();
          this.notificationService.showSuccess(`Password updated successfully`) 
        }, error:(error) =>{
          this.isLoading = false; 
          if (error.status == 422) {
            this.notificationService.showMessage('error', true, `${error.error}`, '');
          } else {
            this.notificationService.showMessage('error', true, `${error.status}
        - ${error.statusText} - ${error.error}`, '');
          }      
        }
      })
    }
// update cell phone
    updateCellPhone(){
      if(!this.editedPhone){
        this.notificationService.showMessage('error', true, `Please enter valid cell phone`, '');
        return;
      }
      this.user.cellPhone = this.editedPhone;
      this.updateUser('Cell Phone');     
    }

    setEditValues(){
      this.editedName = this.user.name;
      this.editedSurname = this.user.surname;
      this.editedPhone = this.user.cellPhone;
    }
  }
