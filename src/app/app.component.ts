import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner/spinner-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'heroes';
  mostrarSpinner$: Observable<boolean>;
  constructor(private spinnerService: SpinnerService) {
    this.mostrarSpinner$ = this.spinnerService.spinnerStatus$;
  }

  ngOnInit() {}
}
