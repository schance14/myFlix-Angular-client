import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent {
  /**
   * A dialog to view specific movies genre information.
   * @param data - Data injected into the dialog, which displays a movie's genre name, and that genre's description. 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string,
     Description: string
    }
  ){}

  ngOnInit(): void {
  }

}