var ReCheckIn = (function ($) {
    var _timeInterval = 30000;
    var _handler;
    var _me = {
        initialize: function () {
            _handler = setTimeout(_me.reCheckin, _timeInterval);
        },

        reCheckin: function () {
            var url = $("#recheckinUrl").val() + "?time=" + new Date().getTime();
            $.ajax({
                url: url,
                async: true,
                type: "GET",
                dataType: "json",
                cache: false,
                success: function (result) {
                    if (result.IsKickedOut) {
                        _me.kickout(result.Message);
                    }

                    clearTimeout(_handler);
                    _handler = setTimeout(_me.reCheckin, _timeInterval);
                },
                statusCode: {
                    500: function (xhr) {
                        if (window.console) console.log(xhr.responseText);
                    },
                    403: function (xhr) {
                        _me.processUnauthorized();
                    },
                    401: function (xhr) {
                        _me.processUnauthorized();
                    }
                }
            });
        },

        kickout: function (message) {
            clearTimeout(_handler);
            message && window.alert(message);
            setTimeout(function () {
                parent.location.href = $("#logoutUrl").val();
            }, 500);
        },

        processUnauthorized: function () {
            alert("Your session was expired!");
            parent.location.reload();
        }
    };
    return _me;
})(jQuery);
ReCheckIn.initialize();