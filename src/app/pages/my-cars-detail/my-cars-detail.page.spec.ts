import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyCarsDetailPage } from './my-cars-detail.page';

describe('MyCarsDetailPage', () => {
  let component: MyCarsDetailPage;
  let fixture: ComponentFixture<MyCarsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCarsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyCarsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
