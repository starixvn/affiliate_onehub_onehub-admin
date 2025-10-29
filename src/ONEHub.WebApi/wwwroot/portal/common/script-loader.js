window.loadScript = (function() {
    const loadedScripts = new Set();
    const loadingScripts = new Map();

    return function(src, options = {}) {
        const { 
            async = true, 
            defer = false,
            type = 'text/javascript',
            onLoad = null,
            onError = null
        } = options;

        const versionedSrc = window.versionedLink ? window.versionedLink(src) : src;

        if (loadedScripts.has(versionedSrc)) {
            if (onLoad) onLoad();
            return Promise.resolve();
        }

        if (loadingScripts.has(versionedSrc)) {
            return loadingScripts.get(versionedSrc);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = versionedSrc;
            script.type = type;
            script.async = async;
            script.defer = defer;

            script.onload = () => {
                loadedScripts.add(versionedSrc);
                loadingScripts.delete(versionedSrc);
                if (onLoad) onLoad();
                resolve();
            };

            script.onerror = (error) => {
                loadingScripts.delete(versionedSrc);
                if (onError) onError(error);
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });

        loadingScripts.set(versionedSrc, promise);
        return promise;
    };
})();

window.loadStylesheet = function(href) {
    const versionedHref = window.versionedLink ? window.versionedLink(href) : href;
    
    const existingLink = document.querySelector(`link[href^="${href}"]`);
    if (existingLink) {
        existingLink.href = versionedHref;
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = versionedHref;
        
        link.onload = resolve;
        link.onerror = reject;
        
        document.head.appendChild(link);
    });
};

