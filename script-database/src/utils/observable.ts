import { Cursor, Collection } from "mongodb";
import { Observable, defer, of, from } from "rxjs"

export function fromCursor(cursor: Cursor) {
  return new Observable<Observable<any>>(obs => {
    // is the connection closed
    let closed = false;

    // get the next document
    function getNext() {
      return cursor.next((err, doc) => {
        if (err) {
          return obs.error(err);
        }

        if (!doc) {
          // no document so we're done
          return obs.complete();
        }

        // call next, however we'll pass it an observable
        // that way we delay fetching the next document until
        // the current one is observed
        obs.next(
          defer(() => {
            if (!closed) {
              getNext();
            }
            return of(doc);
          })
        );
      });
    }

    // start
    getNext();

    // cleanup
    return () => {
      closed = true;
      cursor.close();
    };
  });
}

export const insertDocument = (collection: Collection) => (document: any) =>
  from(collection.insertOne(document));
