import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Token } from '@angular/compiler';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://film-finder-82ebda24dfc3.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

apiUrl = 'https://film-finder-82ebda24dfc3.herokuapp.com';

// const headers = new HttpHeaders({
//   'Authorization': `Bearer ${Token}` });

 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

    // Function to get the token from localStorage
    private getToken(): string | null {
      return localStorage.getItem('token');
    }

 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http
    .post(apiUrl + '/login', userDetails).pipe(map(this.extractResponseData), catchError(this.handleError));
  }


  // Making the api call for the get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/movies`, {headers}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)); 
    }
  

  // Making the api call for the get one movie endpoint
  getOneMovie(title:string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + '/movies/' + title, {headers: new HttpHeaders( 
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Making the api call for getting the director data endpoint
  getDirector(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + '/movies/directors/:Name', {headers: new HttpHeaders( 
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Making the api call for getting the genre data endpoint
  getGenre(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + '/movies/genre/:Name', {headers: new HttpHeaders( 
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Making the api call getting a user endpoint
  getUser(): Observable<any> {
    const token = this.getToken();
    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/users/${user.Name}` , {headers}).pipe(
        catchError(this.handleError)
      );
  }

// Making the api call for getting Users favorite movie list endpoint
getFavoriteMovies(movie: any ): Observable<any> {
  const token = this.getToken();
  const  user  = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<any>(`${this.apiUrl}/users/${user.Name}/movies/${movie._id}`, {headers}).pipe(
      catchError(this.handleError)
    );
}

// Making the api call for adding a movie to favorites list
addFavoriteMovies(movie:any): Observable<any> {
  const token = this.getToken();
  const  user  = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const headers = new HttpHeaders({
    'Authorization': `JWT ${token}` 
});
  return this.http.post<any>(`${this.apiUrl}/users/${user.Name}/movies/${movie._id}`, {headers}).pipe(
    map(this.extractResponseData),
      catchError(this.handleError)
    );
}

// Making the api call to edit a users info
editUser(userData: any): Observable<any> {
  const token = this.getToken();
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.put<any>(`${this.apiUrl}/users/${userData.Name}`, userData, {headers}).pipe(
      catchError(this.handleError)
    );
}

// Making the api call the delete a user profile
deleteUser(): Observable<any> {
  const token = localStorage.getItem('token');
  const  user  = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  return this.http.delete<any>(apiUrl + `/users/${user.Name}` , {headers: new HttpHeaders( 
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
}

// Making the api call to delete a movie from a users favorite list
deleteFavoriteMovie(movie: any): Observable<any> {
  const token = this.getToken();
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.delete<any>(`${this.apiUrl}/users/${user.Name}/movies/${movie._id}`,{ headers }).pipe(
    catchError(this.handleError)
  );
}


  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}` );
    }
    return throwError(
    'Something bad happened; please try again later.');
  }

}


