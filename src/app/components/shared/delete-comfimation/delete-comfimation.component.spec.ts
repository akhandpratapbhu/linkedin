import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComfimationComponent } from './delete-comfimation.component';

describe('DeleteComfimationComponent', () => {
  let component: DeleteComfimationComponent;
  let fixture: ComponentFixture<DeleteComfimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComfimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteComfimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
