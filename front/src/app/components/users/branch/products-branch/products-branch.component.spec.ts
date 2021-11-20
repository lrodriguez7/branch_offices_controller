import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBranchComponent } from './products-branch.component';

describe('ProductsBranchComponent', () => {
  let component: ProductsBranchComponent;
  let fixture: ComponentFixture<ProductsBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
