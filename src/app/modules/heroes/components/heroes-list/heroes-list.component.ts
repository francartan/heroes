import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class HeroesListComponent implements AfterViewInit {
  @ViewChild('inputNombre') inputNombre!: ElementRef<HTMLInputElement>;
  heroesResponse: IHeroe[] = [];
  urlSinImagen: string = './assets/images/nodisponible.png';

  constructor(
    private heroesService: HeroesService,
    private spinnerService: SpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.obtenerHeroes();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.inputNombre) {
      const valorInput$ = fromEvent<KeyboardEvent>(
        this.inputNombre.nativeElement,
        'keyup'
      );

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
    this.heroesService
      .deleteHeroe(heroe)
      .pipe(switchMap(() => this.heroesService.obtenerListadoHeroes()))
      .subscribe({
        next: (res) => {
          this.toastr.success(
            `Héroe ${heroe.nombre} eliminado correctamente`,
            'Eliminado'
          );
          this.spinnerService.hide();
        },
        error: (err) => {
          this.toastr.error(err);
          this.spinnerService.hide();
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
