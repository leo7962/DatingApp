import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'api/users');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'api/users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'api/users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }
}
