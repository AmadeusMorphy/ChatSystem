import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  currentUserId: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserId = localStorage.getItem('userId');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('X-MRNZD-KEY', environment.apiKey);
  }

  getData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/key?key=nizaR*123`, { headers: this.getHeaders() });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/login`, { email, password }, { headers: this.getHeaders() });
  }

  signUp(name: string, email: string, password: string, age: number, dateCreated: Date): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, { name, email, password, age, dateCreated }, { headers: this.getHeaders() });
  }

  getUserId(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/validate-token`, { headers: this.getHeaders() });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }

  getCurrentUserData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${this.currentUserId}`, { headers: this.getHeaders() });
  }

  sendReq(idFriend: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/send-req/${this.currentUserId}`, { friendId: idFriend }, { headers: this.getHeaders() });
  }

  addFriend(idFriend: string): Observable<any> {

    return this.http.post(`${environment.apiUrl}/add-friend/${this.currentUserId}`, { friendId: idFriend }, { headers: this.getHeaders() });
  }

  checkUserLoggedIn() {
    const token = localStorage.getItem('token');

    if (token) {
      return;
    } else {
      return this.router.navigate(['/auth']);
    }
  }
  logout() {
    localStorage.removeItem('token');

    // Create a new URL with a timestamp query parameter to prevent caching
    const newUrl = `${window.location.origin}${window.location.pathname}?cacheBust=${new Date().getTime()}`;

    // Redirect to the new URL to hard reload and avoid cached data
    window.location.href = newUrl;
  }
}
