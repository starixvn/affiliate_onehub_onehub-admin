// Initialize page-specific data (filters, lookups, etc.)
// This script fetches ONLY the required data for each page (optimized!)

window.pageInitializer = {
    // Cache for all filters
    cache: {
        allFilters: null,
        lastFetchTime: null
    },

    // Cache duration: 5 minutes
    CACHE_DURATION: 5 * 60 * 1000,

    // Check if cache is still valid
    isCacheValid() {
        if (!this.cache.lastFetchTime) return false;
        return (Date.now() - this.cache.lastFetchTime) < this.CACHE_DURATION;
    },

    // Fetch ALL filters from single endpoint
    async fetchAllFilters() {
        if (this.isCacheValid() && this.cache.allFilters) {
            return this.cache.allFilters;
        }

        try {
            const response = await fetch(window.initialState.apiBaseUrl + '/landingpage/filters', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            this.cache.allFilters = data;
            this.cache.lastFetchTime = Date.now();

            return data;
        } catch (error) {
            console.error('[PageInit] Error fetching filters:', error);
            return {
                TargetCountryList: [],
                AllLanguagesInSystem: [],
                StatusList: [],
                DealList: [],
                CampaignList: [],
                LandingPageUrl: '',
                ModuleList: [],
                BannerRootUrl: '',
                MaximumFiles: 50,
                MaxFileSize: 3,
                AllowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            };
        }
    },

    // All pages use the same endpoint
    async initLandingPage() {
        const data = await this.fetchAllFilters();
        
        const filterData = {
            targetCountryList: data.TargetCountryList || [],
            allLanguagesInSystem: data.AllLanguagesInSystem || [],
            dealList: data.DealList || [],
            statusList: data.StatusList || [],
            campaignList: data.CampaignList || [],
            landingPageUrl: data.LandingPageUrl || '',
            moduleList: data.ModuleList || [],
            bannerRootUrl: data.BannerRootUrl || '',
            maximumFiles: data.MaximumFiles || 50,
            maxFileSize: data.MaxFileSize || 3,
            allowedExtensions: data.AllowedExtensions || ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        };

        Object.assign(window.initialState, filterData, { filtersLoaded: true });
        return filterData;
    },

    async initPageManagement() {
        return await this.initLandingPage();
    },

    async initAssetUploader() {
        return await this.initLandingPage();
    },

    async initFormManagement() {
        return await this.initLandingPage();
    }
};

