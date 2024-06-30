import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { SynopsisInfoComponent } from '../synopsis-info/synopsis-info.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  FavoriteMovies: any [] = [];
  userData = { Name: '', FavoriteMovies: [] };
  
  constructor(public fetchApiData: UserRegistrationService, public dialog: MatDialog, public snackBar: MatSnackBar,
    public router: Router) { }

ngOnInit(): void {
  this.getMovies();
  this.getUserData();
}

/**
 * Fetches all movies from database.
 *  */
getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp || [];
      console.log(this.movies);
      return this.movies;
    }
    );
  }

/**
* Will retrieve a current user's data.
*/

  getUserData(): void {
    this.fetchApiData.getUser().subscribe(
      (resp: any) => {
        this.user = resp|| {};
        this.FavoriteMovies = this.userData.FavoriteMovies || [];
        console.log(this.user);
      },
      error => {
        console.error(error);
        });
      }

/**
* * Opens dialog from GenreInfoComponent to display a movies genre information.
* @param name - Movie genre name
* @param description - Movie genre description
*/
      
  openGenre(name: string, description: string): void {
  this.dialog.open(GenreInfoComponent, {
    data: {
      Name: name,
      Description: description
    }
  })
}

/**
 * Opens dialog from the DirectorInfoComponent to display a movies director information.
 * @param name - Director's name
 * @param description - Director's bio
 * @param birth - Director's birthdate
 * @param death - Director's date of death if applicable 
 */
openDirector(name: string, description: string, birth: string, death: string): void {
  this.dialog.open(DirectorInfoComponent, {
    data: {
      Name: name,
      Description: description,
      Birth: birth,
      Death: death
    }
  })
}

/**
 * Opens dialog from the SynopsisInfoComponent to display a movies synopsis.
 * @param title - Movies title
 * @param description - Movies synopsis
 */
openSynopsis(title: string, description: string): void{
  this.dialog.open(SynopsisInfoComponent, {
    data: {
     Title: title,
     Description: description
    }
  })
}

/**
 * Checks if a movie has been added to a user's favorite list.
 * @param movie - movie object
 * @returns true or false whether a movie is a favorite or not
 */
isFavorite(movie: any): boolean {
  return this.FavoriteMovies.includes(movie._id);
}

/**
 * Adds a movie to the user's favorite list. 
 * @param movie - movie object 
 */
addMovieToFavorites(movie: any): void{
  this.fetchApiData.addFavoriteMovies(movie).subscribe((resp: any) => {
    console.log(resp);

    //   // Ensures user object is properly structured
    //  if (!this.user.FavoriteMovies) {
    //   this.user.FavoriteMovies = [];
    // }

    this.user.FavoriteMovies.push(movie._id);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.FavoriteMovies.push(movie);
        this.addMovieToFavorites(true);
    this.snackBar.open('Movie added to list!', 'Success', {
      duration: 2000,
    });
    console.log(this.FavoriteMovies);
  },  (error: any) => {
    console.error(error);
    this.snackBar.open('Error adding movie to favorites', 'Close', {
      duration: 2000,
    });
  }
  );
}

/**
 * Deletes a movie from a user's favorite list.
 * @param movie - movie object
 */
  deleteMovieFromFavorites(movie: any): void{
    this.fetchApiData.deleteFavoriteMovie(movie).subscribe((resp: any) => {
      console.log(resp);

      // Ensures user object is properly structured
      if (!this.user.FavoriteMovies) {
        this.user.FavoriteMovies = [];
      }


      this.user.FavoriteMovies = this.user.FavoriteMovies.filter(
        (id: string) => id !== movie._id
      );
      localStorage.setItem('user', JSON.stringify(this.user));
      this.FavoriteMovies = this.FavoriteMovies.filter(
        (id: string) => id !== movie._id
      );
      this.deleteMovieFromFavorites(true);
      this.snackBar.open('Removed from your list!', 'Okay', {
        duration: 2000,
      });
      console.log(this.FavoriteMovies);
      },
      (error: any) => {
        console.error(error);
    })
  }
}


