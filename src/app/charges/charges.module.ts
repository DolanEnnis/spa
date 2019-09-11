import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { ChargesComponent } from './charges.component'

import { ChargesRoutingModule } from './charges-routing.module';



@NgModule({
    imports: [CommonModule, FormsModule, ChargesRoutingModule],
    declarations: [ChargesComponent,
    ],
    exports: [ChargesComponent,
    ]
})
export class ChargesModule { }
