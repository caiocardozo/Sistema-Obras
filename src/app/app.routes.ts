
import { Routes } from '@angular/router';

import { HomeComponent } from './pages/shared/home/home.component';
import { CrudSituationComponent } from './pages/situation/crud-situation/crud-situation.component';
import { ManagerworkComponent } from './pages/managerwork/managerwork.component';
import { CrudTypeOfConstructionComponent } from './pages/typeofconstruction/crud-typeofconstruction/crud-typeofconstruction.component';
import { CrudNatureOfObservationComponent } from './pages/natureofobservation/crud-natureofobservation/crud-natureofobservation.component';
import { CrudTypeOfContractComponent } from './pages/typeofcontract/crud-typeofcontract/crud-typeofcontract.component';
import { CrudTypeOfBondComponent } from './pages/typeofbond/crud-typeofbond/crud-typeofbond.component';
import { CrudTypeOfInspectionComponent } from './pages/typeofinspection/crud-typeofinspection/crud-typeofinspection.component';
import { CrudDocumentTypeConstructionComponent } from './pages/documenttypeconstruction/crud-documenttypeconstruction/crud-documenttypeconstruction.component';

export const rootRouterConfig: Routes = [
    { path: '', component: HomeComponent },
    { path: 'situacaoobra', component: CrudSituationComponent },
    { path: 'gerenciarobra', component: ManagerworkComponent },
    { path: 'tipoobra', component: CrudTypeOfConstructionComponent },
    { path: 'tipocaucao', component: CrudTypeOfBondComponent },
    { path: 'tipocontrato', component: CrudTypeOfContractComponent },
    { path: 'naturezaobs', component: CrudNatureOfObservationComponent },
    { path: 'tipocaucao', component: CrudTypeOfBondComponent },
    { path: 'tipofiscalizacao', component: CrudTypeOfInspectionComponent },
    { path: 'tipodocumento', component: CrudDocumentTypeConstructionComponent },
    { path: 'obra', loadChildren: 'app/pages/construction/construction.module#ConstructionModule' },
];
