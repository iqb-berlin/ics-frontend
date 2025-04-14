import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseCodeComponent } from './response-code.component';

describe('ResponseCodeComponent', () => {
  let component: ResponseCodeComponent;
  let fixture: ComponentFixture<ResponseCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
