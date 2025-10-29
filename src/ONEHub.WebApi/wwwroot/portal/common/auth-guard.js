function authenticateUser(onSuccess) {
    fetch('/api/auth/me', { credentials: 'include' })
    .then(userResponse => {
        if (!userResponse.ok) {
            window.location.href = '/portal/login';
            return Promise.reject('Not authenticated');
        }
        return userResponse.json();
    })
    .then(userData => {
        if (userData && userData.errorCode === 0 && userData.result) {
            var user = userData.result;

            window.initialState.user = {
                userId: user.userId,
                userName: user.userName,
                onUserId: user.onUserId
            };

            var transformedClaims = {};
            if (user.claims && Array.isArray(user.claims)) {
                user.claims.forEach(function(claim) {
                    if (!transformedClaims[claim.type]) {
                        transformedClaims[claim.type] = [];
                    }
                    transformedClaims[claim.type].push(claim.value);
                });
            }

            window.initialState.claims = transformedClaims;
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

