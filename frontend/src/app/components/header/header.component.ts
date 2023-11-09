import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoading = false;
  userIsAuthenticated = false;
  user = {
    name: "",
    surname: "",
  };
  userIdentifier: string;

  constructor(private authService: AuthService, private notificationService: NotificationService,    private router: Router,
    private userService:UserService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.IsAuthenticated();
    if(this.userIsAuthenticated) this.setAuthenticatedUser();
    this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        if(isAuthenticated) this.setAuthenticatedUser();
        this.userIsAuthenticated = isAuthenticated;
        this.cdr.detectChanges(); 
      });
  }

  // check if the user is valid and authenticate user
  setAuthenticatedUser(){
    this.userIdentifier = this.authService.getUserIdentifier();
    this.getUser();
  }

  // get user data by id
getUser(){
  this.isLoading = true; 
  this.userService.getUserById(this.userIdentifier).subscribe(response => {
      this.user.name = response.name;
      this.user.surname = response.surname;
  });

}
//perform action on logout  
  onLogout() {
    this.authService.logout();
  }

}
