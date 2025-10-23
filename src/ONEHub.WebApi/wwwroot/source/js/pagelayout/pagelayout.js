import './lib/jquery.jclock';

var PageLayout = (function ($) {
    var _me = {
        initialize: function () {
            _me.initEvent();
            _me.initClock();
        },

        initEvent: function () {
            $('.nav-link').on('click', function () {
                var $this = $(this);
                var $container = $this.parent().parent();
                $container.find('.nav-link').removeClass('active');
                $this.addClass('active');
            });
        },

        initClock: function () {
            $('#clock').jclock({
                utc: true,
                utcOffset: +8,
                format: '%H:%M:%S %b %d, %Y GMT'
            });
        }
    };

    return _me;
})(jQuery)

PageLayout.initialize();