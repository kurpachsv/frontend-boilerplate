import isBrowser from 'packages/utils/isBrowser';

let promise;

export default isBrowser ?
    (fn) => {
        if (!promise) {
            promise = new Promise(resolve => {
                window.requestAnimationFrame(() => {
                    resolve(fn());
                    promise = null;
                });
            });
        }
        return promise;
    } :
    () => Promise.reject();
