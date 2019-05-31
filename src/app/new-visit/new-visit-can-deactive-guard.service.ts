import {Injectable} from "@angular/core"
import { CanDeactivate } from "@angular/router";
import {NewVisitComponent} from "./new-visit.component"

@Injectable()
export class NewVisitCanDeactaveGuardService implements CanDeactivate<NewVisitComponent>{
   
    canDeactivate(component:NewVisitComponent):  boolean{
        if(component.newShipForm.dirty){
            return confirm('This will discard unsaved changes')
        }
        return true
    }
}

/* This code got from:
https://www.youtube.com/watch?v=WveRq-tlb6I
*/