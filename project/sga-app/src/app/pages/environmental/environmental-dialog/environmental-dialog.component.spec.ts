import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentalDialogComponent } from './environmental-dialog.component';

describe('EnvironmentalDialogComponent', () => {
  let component: EnvironmentalDialogComponent;
  let fixture: ComponentFixture<EnvironmentalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
