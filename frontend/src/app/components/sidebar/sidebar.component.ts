import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  userIsAuthenticated = false;

  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router,
    private userService: UserService, private cdr: ChangeDetectorRef) { }
// check user authentication
  ngOnInit() {
    this.userIsAuthenticated = this.authService.IsAuthenticated();
    this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.cdr.detectChanges(); 
      });
  }
}
