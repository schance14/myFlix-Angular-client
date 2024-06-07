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
  favoritesList: any[] = [];

  constructor(public fetchApiData: UserRegistrationService, public dialog: MatDialog, public snackBar: MatSnackBar,
    public router: Router) { }

ngOnInit(): void {
  this.getMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenre(name: string, description: string): void {
  this.dialog.open(GenreInfoComponent, {
    data: {
      Name: name,
      Description: description
    }
  })
}

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

openSynopsis(title: string, description: string): void{
  this.dialog.open(SynopsisInfoComponent, {
    data: {
     Title: title,
     Description: description
    }
  })
}

isFavorite(movie: any): boolean {
  const favoriteMovie = this.favoritesList.filter((title) => title === movie.Title);
  return favoriteMovie.length ? true : false;
}

addMovieToFavorites(movie: any): void{
  this.fetchApiData.addFavoriteMovies().subscribe((resp: any) => {
    console.log(resp);
    const user = JSON.parse(localStorage.getItem('currentUser') || '');
    user.addMovieToFavorites.push(movie.Title);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.favoritesList.push(movie.Title);
      this.snackBar.open('Movie added to your list!', 'Okay', {
        duration: 2000,
      });
  })
}

deleteMovieFromFavorites(movie: any): void {
  this.fetchApiData.deleteFavoriteMovie().subscribe((resp: any) => {
    console.log(resp);
    const user = JSON.parse(localStorage.getItem('currentUser') || '');
    user.addMovieToFavorites = user.addMovieToFavorites.filter(
      (title: string) => title !== movie.Title);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.favoritesList = this.favoritesList.filter((title: string) => title !== movie.Title);
      this.snackBar.open('Movie removed from list!', 'Okay', {
        duration: 2000,
      });
  })
}

}
