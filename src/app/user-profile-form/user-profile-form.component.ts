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
  
  @Input() userData = { Name: '', Password: '', Email: '', Birthday: '', favoritesList: [] };
  movies: any[] = [];
  user: any = {};
  favoritesList: any[] = [];

constructor(
  public fetchApiData: UserRegistrationService,
  public router: Router,
  public snackbar: MatSnackBar,
){}

  ngOnInit(): void {
  }

userProfile(): void{ 
  this.fetchApiData.getUser();
  this.userData.Name = this.userData.Name;
  this.userData.Password = this.userData.Password;
  this.userData.Email = this.userData.Email;
  this.userData.Birthday = this.userData.Birthday;
  this.fetchApiData.getAllMovies().subscribe((resp) => {
    this.favoritesList = resp.filter((movie:any) => this.user.favoritesList.includes(movie._id));
  })
}

deleteUser(): void {
  this.fetchApiData.deleteUser().subscribe((resp: any) => {
    this.fetchApiData.deleteUser = resp;
    localStorage.clear();
    console.log(resp);
  });
  this.snackbar.open('Your account has been succesfully deleted!', 'Okay', {
    duration: 2000,
  });
  this.router.navigate(['/welcome']);
}

fetchFavoriteMovies(): void {
  this.user= this.fetchApiData.getFavoriteMovies();
  this.userData.favoritesList = this.user.favoritesList;
  this.favoritesList = this.user.favoritesList; 
}

updateProfile(): void {
  this.fetchApiData.editUser().subscribe((resp) => {
    this.fetchApiData.editUser = resp;
    localStorage.setItem('user', JSON.stringify(resp));
    this.snackbar.open('You have sucessfully updated your profile!', 'Okay', {
      duration: 2000
    });
  })
}


}
