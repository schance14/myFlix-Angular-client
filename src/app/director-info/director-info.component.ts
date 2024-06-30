import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})

export class DirectorInfoComponent implements OnInit {
  /**
   * A dialog to view a movies director and that directors information.
   * @param data -Data injected into the dialog to display a movie's director and that director's name, bio, and birthdate.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string,
      Description: string,
      Birth: string,
      Death: string
    }
  ){}

  ngOnInit(): void {
  }

}
