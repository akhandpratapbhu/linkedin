import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionProfileComponent } from './connection-profile.component';

describe('ConnectionProfileComponent', () => {
  let component: ConnectionProfileComponent;
  let fixture: ComponentFixture<ConnectionProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
