import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsetComponent } from './optionset.component';

describe('OptionsetComponent', () => {
  let component: OptionsetComponent;
  let fixture: ComponentFixture<OptionsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsetComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OptionsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
