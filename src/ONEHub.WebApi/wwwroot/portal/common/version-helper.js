window.versionedLink = (function() {
    let versions = {};
    let versionsLoaded = false;
    const CACHE_KEY = 'asset_versions';
    const CACHE_TIME_KEY = 'asset_versions_time';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    function loadVersionsFromCache() {
        try {
            const cachedVersions = sessionStorage.getItem(CACHE_KEY);
            const cacheTime = sessionStorage.getItem(CACHE_TIME_KEY);
            
            if (cachedVersions && cacheTime) {
                const age = Date.now() - parseInt(cacheTime, 10);
                if (age < CACHE_DURATION) {
                    versions = JSON.parse(cachedVersions);
                    versionsLoaded = true;
                    return true;
                }
            }
        } catch (e) {
            console.warn('[VersionHelper] Failed to load cache:', e);
        }
        return false;
    }

    function saveVersionsToCache(versionData) {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(versionData));
            sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        } catch (e) {
            console.warn('[VersionHelper] Failed to save cache:', e);
        }
    }

    function fetchVersions() {
        if (versionsLoaded) return Promise.resolve();

        if (loadVersionsFromCache()) {
            return Promise.resolve();
        }

        return fetch('/api/assets/versions')
            .then(response => response.json())
            .then(data => {
                versions = data;
                versionsLoaded = true;
                saveVersionsToCache(data);
            })
            .catch(error => {
                console.error('[VersionHelper] Failed to fetch versions:', error);
                versions = {};
                versionsLoaded = true;
            });
    }

    fetchVersions();

    return function(path) {
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        const version = versions[normalizedPath] || Date.now();
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}v=${version}`;
    };
})();

