import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceCardComponent } from './sentence-card.component';

describe('SentenceCardComponent', () => {
  let component: SentenceCardComponent;
  let fixture: ComponentFixture<SentenceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentenceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentenceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
