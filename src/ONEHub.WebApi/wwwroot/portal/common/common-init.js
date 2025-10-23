function initializeClock() {
    if (typeof jQuery !== 'undefined' && jQuery.fn.jclock) {
        jQuery('#clock').jclock({
            utc: true,
            utcOffset: +8,
            format: '%H:%M:%S %b %d, %Y GMT'
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClock);
} else {
    initializeClock();
}

