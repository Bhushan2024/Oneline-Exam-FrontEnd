import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultHistoryComponent } from './result-history.component';

describe('ResultHistoryComponent', () => {
  let component: ResultHistoryComponent;
  let fixture: ComponentFixture<ResultHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
