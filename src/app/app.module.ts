import { CustomOption } from './pages/shared/customtoast/customoption';
import { ManagerWorkModule } from './pages/managerwork/managerwork.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
// Rotas
import { Routing, RoutingProviders } from './app.routing';
// toastr
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
//components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/shared/home/home.component';
import { MenuComponent } from './pages/shared/menu/menu/menu.component';
import { FooterComponent } from './pages/shared/menu/footer/footer.component';
import { SubMenuComponent } from './pages/shared/menu/sub-menu/sub-menu.component';
import { HeadBarComponent } from './pages/shared/menu/head-bar/head-bar.component';
import { ListConstructionComponent } from './pages/construction/list-construction/list-construction.component';
//services
import { UserService } from './pages/shared/user/user.service';
import { ConstructionService } from './pages/construction/construction.service';
//modules
import { TypeOfConstructionModule } from './pages/typeofconstruction/typeofconstruction.module';
import { TypeOfInspectionModule } from "app/pages/typeofinspection/typeofinspection.module";
import { DocumentTypeConstructionModule } from "app/pages/documenttypeconstruction/documenttypeconstruction.module";
import { SituationModule } from './pages/situation/situation.module';
import { TypeOfContractModule } from './pages/typeofcontract/typeofcontract.module';
import { TypeOfBondModule } from './pages/typeofbond/typeofbond.module';
import { NatureOfObservationModule } from './pages/natureofobservation/natureofobservation.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadBarComponent,
    MenuComponent,
    SubMenuComponent,
    FooterComponent,
    ListConstructionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    HttpModule,
    MyDatePickerModule,
    Routing,
    ManagerWorkModule,
    SituationModule,
    TypeOfBondModule,
    NatureOfObservationModule,
    TypeOfConstructionModule,
    TypeOfContractModule,
    TypeOfInspectionModule,
    DocumentTypeConstructionModule,
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
