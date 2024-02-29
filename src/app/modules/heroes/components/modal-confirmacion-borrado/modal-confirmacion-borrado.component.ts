import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmacion-borrado',
  templateUrl: './modal-confirmacion-borrado.component.html',
  styleUrls: ['./modal-confirmacion-borrado.component.css'],
})
export class ModalConfirmacionBorradoComponent {
  @Input() nombreHeroe!: string;

  constructor(public activeModal: NgbActiveModal) {}

  cancelar() {
    this.activeModal.close(false);
  }

  aceptar() {
    this.activeModal.close(true);
  }
}
