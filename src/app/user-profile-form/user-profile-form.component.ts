import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {
  
  @Input() userData = { Name: '', Password: '', Email: '', Birthday: '', FavoriteMovies: [] };
  movies: any[] = [];
  name: any[] = [];
  FavoriteMovies: any[] = [];
  user: any = {};

constructor(
  public fetchApiData: UserRegistrationService,
  public router: Router,
  public snackbar: MatSnackBar,
){}

  ngOnInit(): void {
    this.userProfile();
  }

/**
 * Fetches the 'getUser' method to produce the current user's name, email, birthday, and favorite movies list.
 */
userProfile(): void{ 
  this.fetchApiData.getUser().subscribe((resp: any) =>{
  this.user = resp || {};
  this.userData.Name = this.user.Name || '';
  this.userData.Email = this.user.Email || '';
  this.userData.Birthday = this.user.Birthday || '';
  this.userData.FavoriteMovies = this.user.FavoriteMovies || [];
  this.fetchFavoriteMovies();
  })
}
/**
 * Fetches the 'deleteUser' method to clear a user's data from local storage and erase account.
 * Will open snackbar message if successfull and will route the user back to the welcome page. 
 */
deleteProfile(): void {
  this.fetchApiData.deleteUser().subscribe((resp: any) => {
    console.log('Deleted Profile!', resp);
    localStorage.clear();
  });
  this.snackbar.open('Your account has been succesfully deleted!', 'Okay', {
    duration: 2000,
  });
  this.router.navigate(['/welcome']);
}

/**
 * Fetches the 'getAllMovies' method to find the current user's favorite movie's list.
 * Will return the list of movies that have been favorited.
 */
fetchFavoriteMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
    this.movies = resp;
    const { Name } = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    this.userData.Name = Name;
    this.FavoriteMovies = this.movies.filter((movie) =>
      this.FavoriteMovies.includes(movie._id)
    );
    return this.movies;
  });
}


}
