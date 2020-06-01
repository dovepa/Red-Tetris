import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisGridComponent } from './tetris-grid.component';

describe('TetrisGridComponent', () => {
  let component: TetrisGridComponent;
  let fixture: ComponentFixture<TetrisGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TetrisGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TetrisGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
