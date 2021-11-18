import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCompanyComponent } from './nav-company.component';

describe('NavCompanyComponent', () => {
  let component: NavCompanyComponent;
  let fixture: ComponentFixture<NavCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
