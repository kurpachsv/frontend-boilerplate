import isBrowser from './isBrowser';

// Обеспечивает одинаковые идентификаторы элементов SSR и CSR
let idCounter = (isBrowser && parseInt(window.__ID__, 10)) || 0;

export default () => {
    if (idCounter > 1e6) {
        idCounter = 0;
    }
    return (++idCounter).toString();
};
