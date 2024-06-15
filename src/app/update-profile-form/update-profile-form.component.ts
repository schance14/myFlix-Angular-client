import { Component, Input, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrl: './update-profile-form.component.scss'
})
export class UpdateProfileFormComponent {
  @Input() userData = {
    Name: '',
    Password: '',
    Email: '',
    Birthday: '',
};

constructor( 
  public fetchApiData:UserRegistrationService,
  public snackBar: MatSnackBar
) {}

ngOnInit(): void {}

updateUser(): void{
  this.fetchApiData.editUser(this.userData).subscribe(
    (resp: any) => {
      this.userData = resp;
      console.log(resp);
      this.snackBar.open('Update', 'Success', {
        duration: 2000,
      });
    },
    () => {
      this.snackBar.open('Please try again', 'No success', {
        duration: 2000,
      });
    }
  );
}





}
