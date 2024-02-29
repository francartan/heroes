import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { HeroeComponent } from './components/heroe/heroe.component';

const routes: Routes = [
  { path: '', component: HeroesListComponent },
  { path: 'editar', component: HeroeComponent },
  { path: 'nuevo', component: HeroeComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroesRoutingModule {}
