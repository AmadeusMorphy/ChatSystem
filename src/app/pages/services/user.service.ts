import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('X-MRNZD-KEY', environment.apiKey);
  }

  getData(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/key?key=nizaR*123`, {headers: this.getHeaders()})
  }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/login`,{email, password}, {headers: this.getHeaders()})
  }

  signUp(name: string, email: string, password: string, age: number, dateCreated: Date): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, { name, email, password, age, dateCreated }, {headers: this.getHeaders()})
  }

  getUserId(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/validate-token`, {headers: this.getHeaders()})
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${userId}`, {headers: this.getHeaders()})
  }

  checkUserLoggedIn() {
    const token = localStorage.getItem('token');

    if(token) {
      return;
    }else{
      return this.router.navigate(['/auth']);
    }
  }
  logout() {
    localStorage.removeItem('token');
    return this.router.navigate(['/auth'])
  }
}
