import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoadComponent } from './user-road.component';

describe('UserRoadComponent', () => {
  let component: UserRoadComponent;
  let fixture: ComponentFixture<UserRoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
