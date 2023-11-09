import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { NotificationService } from './shared/notification.service';
import { Settings } from './models/settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-bank';
  fontSize: string = '16px';
  color: string = '#000'
  userIdentifier: string;
  settings: Settings;
  showChatbot: boolean = false;
  chatMessages: { text: string; isUser: boolean }[] = [];
  userInput: string = '';
  @ViewChild('chatContainer') chatContainer: ElementRef;
  constructor(private authService: AuthService, private notificationService: NotificationService,
    private userService: UserService,    private router: Router    ){
    }

  ngOnInit(){
    this.userIdentifier = localStorage.getItem('userIdentifier');
    if (!this.router.url.includes('/change-password')) {
      this.getSettings();
    }
    this.authService.getFontSize().subscribe(response =>
      this.fontSize = response);

      this.authService.getContrast().subscribe(response =>
        this.color = response);
  }

  openChatbotPopup() {
    this.showChatbot = !this.showChatbot;
  }


  // get saved settings for user
  getSettings(){
    this.userService.getSettings(this.userIdentifier).subscribe(response => {
        if(response){
          this.settings = response;
          if(this.settings.fontSize){
            this.authService.setFontSize(this.settings.fontSize);
          }
          if(this.settings.contrast){
            this.authService.setContrast(this.settings.contrast);
          }
        }
    });
  
  }

  // chat bot script
  sendMessage(inputText) {
    if (inputText.trim() !== '') {
      let outputText = '';
      this.chatMessages.push({ text: inputText, isUser: true });
      if(inputText.toLowerCase().trim().includes('add an account') || inputText.toLowerCase().trim().includes('add account') || inputText.toLowerCase().trim().includes('adding an account')){
        outputText = 'Certainly i will help you adding an account. Go to account menu, click on add another account button. fill account details and save. This steps and your account is added'        
      } 
      else if(inputText.toLowerCase().trim().includes('bank statement') || inputText.toLowerCase().trim().includes('downloading bank statements')|| inputText.toLowerCase().trim().includes(' how to download bank statements')){
        outputText = 'Certainly i will help you download bank statement. Go to statements menu, select account and range according to your choice and click on download. Thats it, now you can view your bank statment '        
      }
      else if(inputText.toLowerCase().trim().includes('what is settings') || inputText.toLowerCase().trim().includes('settings')){
        outputText = 'Certainly i will help you changing settings. Go to settings menu, select font size and contrast according to your choice and save. Thats it, now you can view application with selected font size and contrast '        
      }
      else if(inputText.toLowerCase().trim().includes('changing password')){
        outputText = 'Certainly i will help you change your password. Go to edit profile menu, select edit in the password section. Now enter your current password and then enter your new password of your choice and click on update button. Thats it, now you have changed your password '        
      }
      else if(inputText.toLowerCase().trim().includes('bill payments') || inputText.toLowerCase().trim().includes('bills') || inputText.toLowerCase().trim().includes('water bill')){
        outputText = 'Certainly i will help you pay your bill of your choice. Go to pay bills menu, select the account you want to pay your bill with and then select the required bill you want to pay. Now enter the required amount and click on Make Payment. Thats it '        
      }
      if(inputText.toLowerCase().trim().includes('forgot your password') || inputText.toLowerCase().trim().includes('reset') || inputText.toLowerCase().trim().includes('reset password')){
        outputText = 'Certainly i will help you change your password if you dont remember it. Go to forgot your password. Enter your email id which you have to create the account.'        
      } 
      else{
        outputText = 'This is a dummy bot response.';
      }
      this.chatMessages.push({ text: outputText, isUser: false });
      this.userInput = ''; // Clear the input field
      this.scrollChatToBottom();
    }
  }

  scrollChatToBottom() {
    const chatContainerElement: HTMLElement = this.chatContainer.nativeElement;
    chatContainerElement.scrollTop = chatContainerElement.scrollHeight;
  }
 
}
