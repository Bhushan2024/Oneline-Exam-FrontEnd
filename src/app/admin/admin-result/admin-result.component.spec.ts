import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResultComponent } from './admin-result.component';

describe('AdminResultComponent', () => {
  let component: AdminResultComponent;
  let fixture: ComponentFixture<AdminResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
