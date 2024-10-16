export default class Scope {
    #deferred = [];

    defer(fn) {
        this.#deferred.push(fn);
    }

    finalize() {
        let fn;
        while ((fn = this.#deferred.pop())) {
            fn();
        }
    }
}
