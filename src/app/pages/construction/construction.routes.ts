import { Routes } from '@angular/router';

import { ConstructionComponent } from './construction.component';
import { DetailsConstructionComponent } from './details-construction/details-construction.component';
import { ListConstructionComponent } from './list-construction/list-construction.component';

export const constructionsRouterConfig: Routes = [
    {
        path: '', component: ConstructionComponent,
        children: [
            { path: '', component: ListConstructionComponent },
            { path: 'detalhes/:id', component: DetailsConstructionComponent },
        ]
    }
];
