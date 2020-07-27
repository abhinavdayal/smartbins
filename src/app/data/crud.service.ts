import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import {Bin, User, Binusage} from './models'

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private db: AngularFireDatabase) { }

  

}
