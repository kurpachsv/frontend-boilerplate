/**
 * Создает эффект вспышки. Используется для визуального
 * обозначает обновление HMR
 */
export default () => {
    if (typeof window === 'undefined') {
        return;
    }

    let shine = document.getElementsByClassName('hmr-shine')[0];

    if (!shine) {
        shine = document.createElement('div');
        shine.classList.add('hmr-shine');
        shine.style.cssText = 'position:fixed;' +
            'top:0;right:0;bottom:0;left:0;' +
            'box-shadow:inset 0 0 50px 10px #a2f193;' +
            'transition:opacity 0.5s ease-out;';

        shine.addEventListener('transitionend', (e) => {
            e.target.style.display = 'none';
        }, false);

        document.body.appendChild(shine);
    }

    shine.style.display = 'block';
    shine.style.opacity = 1;
    setTimeout(() => {
        shine.style.opacity = 0;
        shine.style.display = 'none';
    }, 30);
};
