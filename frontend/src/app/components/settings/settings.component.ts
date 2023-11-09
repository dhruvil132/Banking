import { Component } from '@angular/core';
import { Settings } from 'src/app/models/settings';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isLoading: boolean = false;
  fontOptions: any = [];
  contrastOptions: any =[];
  selectedFontSize: string;
  selectedContrast: string;
  fontSize : string;
  contrastLevel : string; 
  userIdentifier: string;
  settings : Settings = new Settings;
  constructor(private authService: AuthService, private notificationService: NotificationService,
    private userService: UserService,){}

  ngOnInit(){
    this.userIdentifier = localStorage.getItem('userIdentifier');
    this.getFontSize();
    this.getFontContrast();
    this.getSettings();
  }
// get settings by userid
  getSettings(){
    this.isLoading = true; 
    this.userService.getSettings(this.userIdentifier).subscribe({
      next:(response) => {
        this.isLoading = false;
        if(response){
          this.settings = response;
          if(this.settings.fontSize){
            this.selectedFontSize = this.settings.fontSize;
          }
          if(this.settings.contrast){
            this.selectedContrast = this.settings.contrast;
          }        }
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

  // add font size for dropdown
  getFontSize(){
    this.fontOptions = [
      {name: 'Small', value: 'small'},
      {name: 'Normal', value: 'medium'},
      {name: 'Large', value: 'large'},
      {name: 'Extra Large', value: 'x-large'},
      {name: 'Extra Extra Large', value: 'xx-large'}
  ];
  }
  // add contrast for dropdown
  getFontContrast(){
    this.contrastOptions = [
      {name: 'Low', value: '#777'},
      {name: 'Medium-Low', value: '#666'},
      {name: 'Medium', value: '#333'},
      {name: 'Medium-High', value: '#222'},
      {name: 'High', value: '#000'}
  ];
  }
//submit settings 
  submitSettings(){
    if(!this.selectedContrast && !this.selectedFontSize){
      this.notificationService.showMessage('error', true, `Please select one of font size or contrast to save settings.`, '');
    }
    if(this.selectedFontSize){
      this.authService.setFontSize(this.selectedFontSize);
      this.settings.fontSize = this.selectedFontSize;
    }
    if(this.selectedContrast){
      this.authService.setContrast(this.selectedContrast);
      this.settings.contrast = this.selectedContrast;
    }
    if(this.selectedFontSize || this.selectedContrast){
      this.settings.userIdentifier = this.userIdentifier;
      this.updateSettings();
    }
  }
// save settings in db
  updateSettings(){
    this.userService.addSettings(this.settings).subscribe({
      next:(response) => {
        this.settings = response;
        this.isLoading = false;
        this.notificationService.showSuccess(`Settings added/updated successfully`) 
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

}
