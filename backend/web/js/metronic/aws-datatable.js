/**
 * Created by HoangL on 8/13/2015.
 */
function loadDataTableSortAction() {
    if ($('table.dataTable').length > 0) {
        $('.dataTable th.sorting').bind('click', function () {
            var url = $(this).children().first().attr('href');
            if (url) {
                $.pjax({url: url, timeout: false, container: '#w1', push: false});
            }
            return false;
        });
        $('.dataTable th.sorting_asc').bind('click', function () {
            var url = $(this).children().first().attr('href');
            if (url) {
                $.pjax({url: url, timeout: false, container: '#w1', push: false});
            }
            return false;
        });
        $('.dataTable th.sorting_desc').bind('click', function () {
            var url = $(this).children().first().attr('href');
            if (url) {
                $.pjax({url: url, timeout: false, container: '#w1', push: false});
            }
            return false;
        });
        $('table.dataTable').floatThead({
            "floatTableClass": "aws-table-float",
            "floatContainerClass": "aws-thead-float",
            "scrollingTop": 46
        });
    }
    return false;
}
(function ($) {
    loadDataTableSortAction();

    $(document).on('pjax:complete', function () {
        loadDataTableSortAction();
    });

    //$('table.dataTable').floatThead({
    //    useAbsolutePositioning: false
    //    // absolutePositioning is better for
    //    // highly dynamic sites
    //    // (which this is not)
    //});
})(window.jQuery);
