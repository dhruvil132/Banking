import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './shared/auth-guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransferFundsComponent } from './components/transfer-funds/transfer-funds.component';
import { PayBillsComponent } from './components/pay-bills/pay-bills.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },
  { path: 'change-password/:id', component: ChangePasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutUsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'transfers', component: TransferFundsComponent, canActivate: [AuthGuard] },
  { path: 'pay-bills', component: PayBillsComponent, canActivate: [AuthGuard] },
  { path: 'help-support', component: HelpSupportComponent },
  { path: 'user', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/',pathMatch: 'full' },
   { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
