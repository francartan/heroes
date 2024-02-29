import { Injectable } from '@angular/core';
import {
  IHeroe,
  IHeroeResponse,
} from '../../interfaces/heroe-response.interface';
import { Observable, Subject, delay, filter, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  // Datos simulados como si fuera la respuesta del back inicial, sobre este array se irá editando, añadiendo y borrando
  private datosMockHeroes = {
    resultados: [
      {
        id: 1,
        nombre: 'Batman',
        raza: 'Humano',
        base: 'Gotham City',
        imagen:
          'https://www.superherodb.com/pictures2/portraits/10/100/10441.jpg',
      },
      {
        id: 2,
        nombre: 'Spider-Man',
        raza: 'Humano',
        base: 'Nueva York',
        imagen:
          'https://www.superherodb.com/pictures2/portraits/10/100/133.jpg',
      },
      {
        id: 3,
        nombre: 'Capitán América',
        raza: 'Humano',
        base: 'Nueva York',
        imagen:
          'https://www.superherodb.com/pictures2/portraits/10/100/274.jpg',
      },
      {
        id: 4,
        nombre: 'Hulk',
        raza: 'Radioactivo',
        base: 'Nuevo México',
        imagen: 'https://www.superherodb.com/pictures2/portraits/10/100/83.jpg',
      },
    ],
  };
  private heroeSeleccionadoTabla!: IHeroe;

  constructor(private http: HttpClient) {}

  // Delay de 1 segundo para simular una llamada a una API y el filtro para simular también el filtrado del servicio
  obtenerListadoHeroes(): Observable<IHeroe[]> {
    return of<IHeroeResponse>(this.datosMockHeroes).pipe(
      delay(1000),
      map((heroes) => heroes.resultados)
    );
  }

  // Delay de 1 segundo para simular una llamada a una API y el filtro para simular también el filtrado del servicio
  obtenerListadoHeroesPorNombre(nombre: string): Observable<IHeroe[]> {
    return of<IHeroeResponse>(this.datosMockHeroes).pipe(
      delay(1000),
      map((heroes) =>
        heroes.resultados.filter((heroe) =>
          heroe.nombre.toLowerCase().includes(nombre.toLowerCase())
        )
      )
    );
  }

  // Este servicio con una API real, llamaría con el id a una url y le pasaría en el body el objeto en cuestión
  putModificarHeroe(heroe: IHeroe, id: number) {
    return of<{ codigo: number; mensaje: string }>({
      codigo: 200,
      mensaje: `Héroe ${heroe.nombre} actualizado correctamente`,
    }).pipe(
      delay(1000),
      tap(() => {
        let indiceHeroe = this.datosMockHeroes.resultados.findIndex(
          (heroe) => heroe.id === id
        );
        if (indiceHeroe !== -1) {
          heroe.id = id;
          this.datosMockHeroes.resultados[indiceHeroe] = heroe;
        }
      })
    );
  }

  // Este servicio con una API real, llamaría a una url y le pasaría en el body el objeto en cuestión
  postCrearHeroe(heroe: IHeroe) {
    // Se genera un número aleatorio entre 1 y 1000 para simular la generación del back de un id(confío en que no coincida con los que ya existen, son datos mockeados)
    // en el back sería un contador, lo sé, pero es una aplicación de prueba
    return of<{ codigo: number; mensaje: string }>({
      codigo: 200,
      mensaje: `Héroe ${heroe.nombre} creado correctamente`,
    }).pipe(
      delay(1000),
      tap(() => {
        const numeroAleatorio = Math.floor(Math.random() * 1000) + 1;
        heroe.id = numeroAleatorio;
        this.datosMockHeroes.resultados.push(heroe);
      })
    );
  }

  deleteHeroe(heroe: IHeroe) {
    // Se llamaría al back pasando el id, pero aquí está moqueado a mi estilo para hacer la aplicación mockeada
    return of<{ codigo: number; mensaje: string }>({
      codigo: 200,
      mensaje: `Héroe ${heroe.nombre} eliminado correctamente`,
    }).pipe(
      delay(1000),
      tap(() => {
        let indiceHeroe = this.datosMockHeroes.resultados.findIndex(
          (res) => res.id === heroe.id
        );
        if (indiceHeroe !== -1) {
          this.datosMockHeroes.resultados.splice(indiceHeroe, 1);
        }
      })
    );
  }

  setHeroeSeleccionadoTabla(heroe: IHeroe) {
    this.heroeSeleccionadoTabla = heroe;
  }

  getHeroeSeleccionadoTabla(): IHeroe {
    return this.heroeSeleccionadoTabla;
  }
}
