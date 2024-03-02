import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDiskComponent } from './my-disk.component';

describe('MyDiskComponent', () => {
  let component: MyDiskComponent;
  let fixture: ComponentFixture<MyDiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDiskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
