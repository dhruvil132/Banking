
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(environment.server + 'api/user/addUser', user);
  }

  public getUserById(userIdentifier: string): Observable<User> {
    return this.http.get<User>(environment.server + `api/user/getUserById/${userIdentifier}`);
  }
  public checkUserExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.server + `api/user/checkUserExists/${email}`);
  }
  public updateUser(userIdentifier: string,user: User): Observable<User> {
    return this.http.post<User>(environment.server + `api/user/updateUser/${userIdentifier}`, user);
  }
  public updateUserEmail(userIdentifier: string,user: User): Observable<User> {
    return this.http.post<User>(environment.server + `api/user/updateUserEmail/${userIdentifier}`, user);
  }
  public changePassword(userIdentifier: string,user: User): Observable<User> {
    return this.http.post<User>(environment.server + `api/user/changePassword/${userIdentifier}`, user);
  }
  public sendForgotPasswordMail(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.server + `api/user/sendForgotPasswordMail/${email}`);
  }
  public addSettings(settings:Settings ): Observable<Settings> {
    return this.http.post<Settings>(environment.server + `api/user/addSettings`, settings);
  }
  public verifyUser(user:User ): Observable<boolean> {
    return this.http.post<boolean>(environment.server + `api/user/verifyUser`, user);
  }
  public getSettings(userIdentifier: string): Observable<Settings> {
    return this.http.get<Settings>(environment.server + `api/user/getSettings/${userIdentifier}`);
  }
}


