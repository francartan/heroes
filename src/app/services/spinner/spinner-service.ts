import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerStatus$ = this.spinnerSubject.asObservable();

  show() {
    this.spinnerSubject.next(true);
  }

  hide() {
    this.spinnerSubject.next(false);
  }
}
