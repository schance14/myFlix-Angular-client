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
  userData = { Name: '', favoritesList: [] };

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
  // getUsers(): void {
  //   const { Name } = JSON.parse(
  //     localStorage.getItem('currentUser') || '{}'
  //   );
  //   this.fetchApiData.getUser().subscribe((resp: any) => {
  //     this.user = resp;
  //     const currentUser = this.user.filter(
  //       (user: { Name: any; }) => user.Name === Name
  //     );

  //     this.favoritesList = currentUser[0].FavoriteMovies;
  //   });
  // }

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

isFavorite(movieId: any): boolean {
  const favoriteMovie = this.favoritesList.filter((title) => title === movieId);
  return favoriteMovie.length ? true : false;
}

addMovieToFavorites(movie: any): void{
  const movieId = movie._id;
  if (!movieId || typeof movieId !== 'string') {
    this.snackBar.open('Invalid movie ID', 'Okay', {
      duration: 2000,
    });
    return;
  }
  this.fetchApiData.addFavoriteMovies(movieId).subscribe((resp: any)=> {
    console.log(resp);
    const user = JSON.parse(localStorage.getItem('currentUser') || '');
    if (user && user.favoritesList) {
    user.favoritesList.push(movieId);
    localStorage.setItem('currentUser', JSON.stringify(user));
    }
  })
  this.favoritesList.push(movie.Title);
      this.snackBar.open('Movie added to your list!', 'Okay', {
        duration: 2000,
      });
  }

  deleteMovieFromFavorites(movie: any): void{
    this.fetchApiData.deleteFavoriteMovie().subscribe((resp: any) => {
      console.log(resp);
      const user = JSON.parse(localStorage.getItem('currentUser') || '');
      user.favoritesList = user.favoritesList.filter(
        (title: string) => title !== movie.Title
      );
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.snackBar.open('Removed from your list!', 'Okay', {
        duration: 2000,
      });
    })
  }
}


