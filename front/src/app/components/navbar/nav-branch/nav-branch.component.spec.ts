import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBranchComponent } from './nav-branch.component';

describe('NavBranchComponent', () => {
  let component: NavBranchComponent;
  let fixture: ComponentFixture<NavBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
