/**
 * Defer some cleanup until explicitly invoked.
 * Useful for cleaning up things that aren't tied to local or block scope.
 */
export default class Scope {
    /** @type {Function[]} */
    #deferred = [];

    /**
     * Add a deferred call.
     * @param {Function} fn Function to defer.
     */
    defer(fn) {
        this.#deferred.push(fn);
    }

    /**
     * Invoke all deferred calls in reverse insert order.
     */
    finalize() {
        let fn;
        while ((fn = this.#deferred.pop())) {
            fn();
        }
    }
}
