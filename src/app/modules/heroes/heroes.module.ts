import { NgModule } from '@angular/core';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { CommonModule } from '@angular/common';
import { HeroesRoutingModule } from './heroes-routing.module';
import { HeroeComponent } from './components/heroe/heroe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmacionBorradoComponent } from './components/modal-confirmacion-borrado/modal-confirmacion-borrado.component';

@NgModule({
  imports: [HeroesRoutingModule, CommonModule, ReactiveFormsModule],
  declarations: [
    HeroesListComponent,
    HeroeComponent,
    ModalConfirmacionBorradoComponent,
  ],
})
export class HeroesModule {}
