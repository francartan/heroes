import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { IHeroe } from 'src/app/interfaces/heroe-response.interface';

import { HeroesService } from 'src/app/services/heroes/heroes.service';
import { SpinnerService } from 'src/app/services/spinner/spinner-service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css'],
})
export class HeroeComponent {
  heroe!: IHeroe;
  heroeForm!: FormGroup;
  accion!: string;
  imagenSegura: SafeResourceUrl | null = null;
  urlSinImagen: string = './assets/images/nodisponible.png';

  constructor(
    private router: Router,
    private heroesService: HeroesService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) {
    this.heroeForm = this.fb.group({
      nombre: [null, Validators.required],
      raza: ['', Validators.required],
      base: [null, Validators.required],
      imagen: [
        null,
        Validators.pattern(
          "^(https?|ftp):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([a-zA-Z0-9-._~:/?#[\\]@!$&'()*+,;=]+)*$"
        ),
      ],
    });
  }

  ngOnInit() {
    this.accion = this.router.url.split('/')[2];

    if (this.accion === 'editar') {
      // Esto en una aplicación normal conectada con una api, se podría hacer también consultando al back con un id
      this.heroe = this.heroesService.getHeroeSeleccionadoTabla();
      if (this.heroe) {
        // Actualizar el formulario
        this.heroeForm.patchValue(this.heroe);
        this.imagenSegura = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.heroe.imagen
        );
      } else {
        // El usuario ha recargado y se ha perdido el valor del héroe, por lo que se redirige al listado
        this.router.navigate(['heroes']);
      }
    }

    // Observable para la imagen
    this.heroeForm
      .get('imagen')
      ?.valueChanges.pipe(
        debounceTime(500),
        switchMap((imagenUrl) => this.cargarImagen(imagenUrl))
      )
      .subscribe((imagenSegura) => {
        this.imagenSegura = imagenSegura;
      });
    // Observable para convertir en mayúscula el campo de nombre
    this.heroeForm
      .get('nombre')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((nombre) =>
        this.heroeForm
          .get('nombre')
          ?.patchValue(nombre.toUpperCase(), { emitEvent: false })
      );
  }

  guardarHeroe() {
    this.spinnerService.show();
    if (this.accion === 'editar') {
      this.heroesService
        .putModificarHeroe(this.heroeForm.value, this.heroe.id)
        .pipe(tap(() => this.spinnerService.hide()))
        .subscribe({
          next: (res) => {
            this.mensajeYNavegar(res, this.accion);
          },
          error: (err) => {
            this.toastr.error(err);
          },
        });
    } else {
      this.heroesService
        .postCrearHeroe(this.heroeForm.value)
        .pipe(tap(() => this.spinnerService.hide()))
        .subscribe({
          next: (res) => {
            this.mensajeYNavegar(res, this.accion);
          },
          error: (err) => {
            this.toastr.error(err);
          },
        });
    }
  }

  cargarImagen(imagenUrl: string): Observable<SafeResourceUrl | null> {
    if (imagenUrl && imagenUrl.trim() !== '') {
      return of(imagenUrl).pipe(
        map(() => this.sanitizer.bypassSecurityTrustResourceUrl(imagenUrl)),
        catchError(() => of(null))
      );
    } else {
      return of(null);
    }
  }

  mensajeYNavegar(
    respuesta: { codigo: number; mensaje: string },
    titulo: string
  ) {
    this.toastr.success(
      respuesta.mensaje,
      titulo.charAt(0).toUpperCase() + titulo.slice(1)
    );
    this.router.navigate(['heroes']);
  }

  campoInvalido(campo: string) {
    return this.heroeForm.get(campo)?.invalid;
  }

  get imagen() {
    return this.heroeForm.get('imagen') as FormControl;
  }
}
