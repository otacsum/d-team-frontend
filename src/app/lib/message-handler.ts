import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MessageService} from '../messages/message.service';

@Injectable({
    providedIn: 'root'
})

export class MessageHandler {
    constructor(
        private messageService: MessageService,
    ) {}

    /** Log a PeopleService message with the MessageService */
    public log(message: string) {
        this.messageService.add(message);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T>(operation = 'Operation', result?: T) {
        return (error: any): Observable<T> => {
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
