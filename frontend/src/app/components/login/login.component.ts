import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/shared/utils';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent { 
  isLoading = false;
  hidePassword :boolean = true;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private _router: Router) {}

    ngOnInit(): void {
      //  redirect to home if already logged in
       if (this.authService.IsAuthenticated()) {
         this._router.navigate(['/dashboard']);
        }
      }

      // perform action on login click
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    let user = new User();
    user.email = form.value.email;
    user.password = form.value.password;
    this.authService.loginUser(user);
    this.isLoading = false;
  }
// hide show password
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
