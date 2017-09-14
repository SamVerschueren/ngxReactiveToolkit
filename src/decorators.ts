import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

// These decorators are all about utils to turn lifecycle events into streams
/*
    The Destroy decorator creates a stream that gets nexted when the ngOnDestroy is being called.
    A use case might be to avoid memoryleaks by using the takeUntil operator
    @Component({
        selector: 'my-component',
        template: `...`,
    })
    export class HelloComponent {
        @Destroy() destroy$;

        constructor() {
            Observable.interval(500)
                .takeUntil(this.destroy$)
                .subscribe(e => console.log(e));
        }
    }
*/

export function Destroy() {
    return function (target: any, key: string) {
        target[key] = new ReplaySubject(1);
        const oldNgOnDestroy = target.ngOnDestroy;
        target.ngOnDestroy = () => {
            if (oldNgOnDestroy) {
                oldNgOnDestroy();
            }
            target[key].next(true);
        }
    }
}

/*
    The Changes decorator creates a stream that gets nexted when the ngOnDestroy is being called.
    A use case might be to avoid memoryleaks by using the takeUntil operator
    @Component({
        selector: 'my-component',
        template: `...`,
    })
    export class HelloComponent {
        @Changes() changes$;

        constructor() {
            this.changes$.subscribe(e => console.log(e));
        }
    }
*/
export function Changes() {
    return function (target: any, key: string) {
        target[key] = new ReplaySubject(1);
        const oldNgOnChanges = target.ngOnChanges;
        target.ngOnChanges = (simpleChanges: SimpleChanges) => {
            if (oldNgOnChanges) {
                oldNgOnChanges();
            }
            target[key].next(simpleChanges);
        }
    }
}