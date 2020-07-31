import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CrudService } from '../../../data/crud.service';
import { SmartbinUser } from 'src/app/data/models';

@Component({
  selector: 'app-bins-near-me',
  templateUrl: './bins-near-me.component.html',
  styleUrls: ['./bins-near-me.component.scss'],
})
export class BinsNearMeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public crudService: CrudService
  ) {}

  user: SmartbinUser;
  ngOnInit(): void {}
}
