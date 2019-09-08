import {Injectable} from "@angular/core"
import { CanDeactivate } from "@angular/router";
import {DetailComponent} from "./detail.component"

@Injectable()
export class UpdateTripCanDeactaveGuardService implements CanDeactivate<DetailComponent>{
   
    canDeactivate(component:DetailComponent):  boolean{
        if(component.shipForm.dirty){
            return confirm('This will discard unsaved changes')
        }
        return true
    }
}

/* This code got from:
https://www.youtube.com/watch?v=WveRq-tlb6I
*/