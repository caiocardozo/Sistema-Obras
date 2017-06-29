import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
// toastr
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { MyDatePickerModule } from 'mydatepicker';
//components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/shared/home/home.component';
import { MenuComponent } from './pages/shared/menu/menu/menu.component';
import { FooterComponent } from './pages/shared/menu/footer/footer.component';
import { SubMenuComponent } from './pages/shared/menu/sub-menu/sub-menu.component';
import { HeadBarComponent } from './pages/shared/menu/head-bar/head-bar.component';
import { ListConstructionComponent } from './pages/construction/list-construction/list-construction.component';
import { CustomOption } from './pages/shared/customtoast/customoption';
//services
import { UserService } from './pages/shared/user/user.service';
import { ConstructionService } from './pages/construction/construction.service';
//modules
import { ConstructionModule } from './pages/construction/construction.module';
import { TypeOfConstructionModule } from './pages/typeofconstruction/typeofconstruction.module';
import { TypeOfInspectionModule } from "app/pages/typeofinspection/typeofinspection.module";
import { DocumentTypeConstructionModule } from "app/pages/documenttypeconstruction/documenttypeconstruction.module";
import { SituationModule } from './pages/situation/situation.module';
import { TypeOfContractModule } from './pages/typeofcontract/typeofcontract.module';
import { TypeOfBondModule } from './pages/typeofbond/typeofbond.module';
import { NatureOfObservationModule } from './pages/natureofobservation/natureofobservation.module';
import { ManagerWorkModule } from './pages/managerwork/managerwork.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadBarComponent,
    MenuComponent,
    SubMenuComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    HttpModule,
    MyDatePickerModule,
    ManagerWorkModule,
    SituationModule,
    TypeOfBondModule,
    NatureOfObservationModule,
    TypeOfConstructionModule,
    TypeOfContractModule,
    TypeOfInspectionModule,
    DocumentTypeConstructionModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  providers: [ConstructionService, UserService,
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: ToastOptions, useClass: CustomOption //custom notification
    }],

  bootstrap: [AppComponent]
})
export class AppModule { }
