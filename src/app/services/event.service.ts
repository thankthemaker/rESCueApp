import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private event = new Subject<any>();

    publishApplicationEvent(data: any) {
        this.event.next(data);
    }

    getObservable(): Subject<any> {
        return this.event;
    }
}