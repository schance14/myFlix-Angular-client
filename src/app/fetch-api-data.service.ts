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

/**
 * This will provide HttpClient to the entire class, making it available via this.http . 
*/ 
  constructor(private http: HttpClient) {
  }

/**
* Method to get the token from localStorage.
* @returns token - retrieves token from local storage via getItem method
*/
    private getToken(): string | null {
      return localStorage.getItem('token');
    }

/**
 * API call to register a new user.
 * @param userDetails - user details provided by user.
 * @returns Observable - user registration response
 */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

/**
 * API call to login a registerd user.
 * @param userDetails - the user's login credentials
 * @returns Observable - login response
 */
  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http
    .post(apiUrl + '/login', userDetails).pipe(map(this.extractResponseData), catchError(this.handleError));
  }


/**
 * API call to fetch list of movies from the database.
 * @returns Observable with movie list array
 */
  getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/movies`, {headers}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)); 
    }
  

/**
 * API call to fetch one movie by title from the database.
 * @param title - movie title
 * @returns Observable with the movie title 
 */
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

/**
 * API call to fetch movie director details by name. 
 * @returns Observable with the directors information
 */
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

/**
 * API call to fetch movie genre details by name. 
 * @returns Observable with movie genre information
 */
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

/**
 * API call to fetch a user by name.
 * @returns Observable with a user's details. 
 */
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

/**
 * API call to fetch a user's favorite movies list.
 * @param movie - movie object
 * @returns Observable with favorite movie list details
 */
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

/**
 * API call to add a movie to a user's favorite list.
 * @param movie - movie object to be added.
 * @returns Observable with movie being added to user's favorite list, updating the list.
 */
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

/**
 * API call to update a user's profile information.
 * @param userData - the user's details
 * @returns Observable with updated userData
 */
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

/**
 * API call to delete a user's profile.
 * @returns Observable with the user's data being cleared from local storage 
 */
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

/**
 * API call to delete a movie from a user's favorite list.
 * @param movie - movie object to be deleted from list
 * @returns Observable with the movie being removed from list
 */
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

/**
 * Extracts response data from HTTP response. 
 * @param resp - response body 
 * @returns extracted response data
 */
  private extractResponseData(resp: any): any {
    const body = resp;
    return body || { };
  }

/**
 * Responds to HTTP errors.
 * @param error - error response
 * @returns Observable with error message
 */
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


