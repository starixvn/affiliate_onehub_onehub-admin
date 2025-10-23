function authenticateUser(onSuccess) {
    Promise.all([
        fetch('/api/auth/me', { credentials: 'include' }),
        fetch('/api/auth/menu', { credentials: 'include' })
    ])
    .then(([userResponse, menuResponse]) => {
        if (!userResponse.ok || !menuResponse.ok) {
            window.location.href = '/portal/login';
            return Promise.reject('Not authenticated');
        }
        return Promise.all([userResponse.json(), menuResponse.json()]);
    })
    .then(([userData, menuData]) => {
        if (userData && userData.IsSuccessful) {
            window.initialState.user = {
                userId: userData.UserId,
                userName: userData.UserName,
                onUserId: userData.OnUserId
            };
            
            // Transform claims from array [{ Type, Value }] to object { Type: [Value] }
            var transformedClaims = {};
            if (userData.Claims && Array.isArray(userData.Claims)) {
                userData.Claims.forEach(function(claim) {
                    if (!transformedClaims[claim.Type]) {
                        transformedClaims[claim.Type] = [];
                    }
                    transformedClaims[claim.Type].push(claim.Value);
                });
            }
            
            window.initialState.claims = transformedClaims;
            
            if (menuData && menuData.IsSuccessful) {
                window.initialState.menus = menuData.Menus || [];

                // Dispatch event to notify React components that menus are ready
                window.dispatchEvent(new CustomEvent('menusLoaded', { 
                    detail: window.initialState.menus 
                }));
            }
            
            window.globalVariables = {
                claims: transformedClaims
            };
            
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            window.location.href = '/portal/login';
        }
    })
    .catch(error => {
        console.error('Auth error:', error);
        if (error !== 'Not authenticated') {
            window.location.href = '/portal/login';
        }
    });
}

