import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoderSelectComponent } from './coder-select.component';

describe('CoderSelectComponent', () => {
  let component: CoderSelectComponent;
  let fixture: ComponentFixture<CoderSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoderSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
