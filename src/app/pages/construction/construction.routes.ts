
import { Routes } from '@angular/router';

import { ConstructionComponent } from './construction.component';
import { DetailsConstructionComponent } from './details-construction/details-construction.component';
import { ListConstructionComponent } from './list-construction/list-construction.component';
import { EditConstructionComponent } from './edit-construction/edit-construction.component';
import { AddConstructionComponent } from './add-construction/add-construction.component';

export const constructionsRouterConfig: Routes = [
    {
        path: '', component: ConstructionComponent,
        children: [
            { path: '', component: ListConstructionComponent },
            { path: 'adicionar', component: AddConstructionComponent },
            { path: 'detalhes/:id', component: DetailsConstructionComponent },
            { path: 'editar/:id', component: EditConstructionComponent },
        ]
    }
];
