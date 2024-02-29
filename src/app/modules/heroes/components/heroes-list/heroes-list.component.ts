import { Component } from '@angular/core';
import { debounceTime, filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { HeroesService } from '../../../../services/heroes/heroes.service';
import { SpinnerService } from '../../../../services/spinner/spinner-service';
import { Router } from '@angular/router';
import { IHeroe } from 'src/app/interfaces/heroe-response.interface';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacionBorradoComponent } from '../modal-confirmacion-borrado/modal-confirmacion-borrado.component';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.css'],
})
export class HeroesListComponent {
  heroesResponse: IHeroe[] = [];
  urlSinImagen: string = './assets/images/nodisponible.png';

  constructor(
    private heroesService: HeroesService,
    private spinnerService: SpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    // Hace la llamada inicial que devuelve todos los héroes
    this.obtenerHeroes();
  }

  ngOnInit() {
    /* Lo hago así sin un formulario reactivo ya que no es necesario usarlos aquí pues sólo hay un campo y sin validaciones,
       por lo que no tiene sentido usar aquí un formulario reactivo, me parece mejor idea hacerlo así
    */
    const input = document.getElementById('inputNombre');
    if (input) {
      const valorInput$ = fromEvent<KeyboardEvent>(input, 'keyup');

      // Se crea un observable del evento keyup del input y se pasa por un tiempo de espera para evitar las múltiples llamadas al back
      // También se muestra un spinner para simular la carga hasta que termina la llamada que tiene un delay de 1 segundo
      valorInput$
        .pipe(
          debounceTime(500),
          map<KeyboardEvent, string>(
            (event) => (event?.target as HTMLInputElement)?.value ?? ''
          ),
          tap(() => this.spinnerService.show()),
          switchMap((cadena) =>
            this.heroesService.obtenerListadoHeroesPorNombre(cadena)
          ),
          tap(() => this.spinnerService.hide())
        )
        .subscribe({
          next: (res) => {
            this.heroesResponse = res;
          },
          error: (err) => {
            alert(err);
          },
        });
    }
  }

  obtenerHeroes() {
    this.spinnerService.show();
    this.heroesService
      .obtenerListadoHeroes()
      .pipe(tap(() => this.spinnerService.hide()))
      .subscribe({
        next: (res) => {
          this.heroesResponse = res;
        },
        error: (err) => {
          alert(err);
        },
      });
  }

  borrarHeroe(heroe: IHeroe) {
    this.spinnerService.show();
    this.heroesService.deleteHeroe(heroe).subscribe({
      next: (res) => {
        this.toastr.success(res.mensaje, 'Eliminado');
        this.spinnerService.hide();
        // Volvemos a llamar a la búsqueda para recargar la tabla
        this.obtenerHeroes();
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });
  }

  abrirModalConfirmacionBorrado(heroe: IHeroe) {
    const modal = this.modalService.open(ModalConfirmacionBorradoComponent);
    modal.componentInstance.nombreHeroe = heroe.nombre;

    modal.result.then((borrar: boolean) => {
      if (borrar) {
        this.borrarHeroe(heroe);
      }
    });
  }

  navegarHeroe(heroe?: IHeroe) {
    if (heroe) {
      this.heroesService.setHeroeSeleccionadoTabla(heroe);
      this.router.navigate(['/heroes/editar']);
    } else {
      this.router.navigate(['/heroes/nuevo']);
    }
  }
}
