import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  isLoading = false;
  userIdentifier: string;
  user : User;
  changePasswordForm: FormGroup;
  editedPassword: string;
  editedConfirmPassword: string;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  message: string = null;
  error: boolean = false;
  constructor(private authService: AuthService,    private _route: ActivatedRoute,
     private notificationService: NotificationService,private router: Router,
    private userService:UserService, private fb: FormBuilder) { 
      this.user = new User();
      this._route.params.subscribe(params => {
        let paramId = params['id'];
        if (typeof paramId != 'undefined') {
          this.userIdentifier= paramId;
        }
      });
    }

  ngOnInit(){
this.createForm();
}

  createForm() {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required,Validators.maxLength(64), Validators.minLength(8) ]],
      confirmPassword: ['', [Validators.required,Validators.maxLength(64), Validators.minLength(8) ]]
    });
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // change password
  changePassword(){
    if (!this.changePasswordForm.valid) {
      Utils.validateAllFormFields(this.changePasswordForm);
      return;
    }
    if(this.editedPassword.toLowerCase() != this.editedConfirmPassword.toLowerCase()){
      this.error = true;
      this.message = 'Password and Confirm Password must match';
      return;
    }
    this.isLoading = true; 
    this.user.userIdentifier = this.userIdentifier;
    this.user.password = this.editedPassword;
    this.userService.changePassword(this.userIdentifier, this.user).subscribe({
      next:(response) => {
        this.user = response;
        this.isLoading = false;
        this.notificationService.showSuccess(`Password updated successfully`) 
        this.moveToLogin();
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
  // navigate to login
  moveToLogin(){
    this.router.navigate(['/login']);
  }
}
