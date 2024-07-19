import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendchatmessageComponent } from './sendchatmessage.component';

describe('SendchatmessageComponent', () => {
  let component: SendchatmessageComponent;
  let fixture: ComponentFixture<SendchatmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendchatmessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendchatmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
