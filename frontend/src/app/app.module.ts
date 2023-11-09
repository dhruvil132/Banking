import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { HeaderComponent } from './components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Import the MatProgressBarModule
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {DialogModule} from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { InputMaskModule } from 'primeng/inputmask';
import { SettingsComponent } from './components/settings/settings.component';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CalendarModule } from 'primeng/calendar';
import { TransferFundsComponent } from './components/transfer-funds/transfer-funds.component';
import { PayBillsComponent } from './components/pay-bills/pay-bills.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HeaderComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    MyAccountComponent,
    SidebarComponent,
    ChangePasswordComponent,
    UserDetailsComponent,
    HelpSupportComponent,
    AboutUsComponent,
    SettingsComponent,
    TransactionsComponent,
    TransferFundsComponent,
    PayBillsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCheckboxModule,
    HttpClientModule,
    MatTableModule,
    MatProgressBarModule,
    ToastModule,
    BlockUIModule,
    OverlayPanelModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    InputNumberModule,
    InputMaskModule,
    DropdownModule,
    TableModule,
    ToolbarModule,
    CalendarModule,
    ConfirmDialogModule
    ],
  providers: [MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
