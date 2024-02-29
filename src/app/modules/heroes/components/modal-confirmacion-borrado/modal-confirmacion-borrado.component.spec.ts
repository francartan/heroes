import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionBorradoComponent } from './modal-confirmacion-borrado.component';

describe('ModalConfirmacionBorradoComponent', () => {
  let component: ModalConfirmacionBorradoComponent;
  let fixture: ComponentFixture<ModalConfirmacionBorradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmacionBorradoComponent],
    });
    fixture = TestBed.createComponent(ModalConfirmacionBorradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
