import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

  name = '';
  constructor( public dialogRef: MatDialogRef<ProfileDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close()
  }

  sendName(): void {
    this.dialogRef.close(this.name)
  }

}
