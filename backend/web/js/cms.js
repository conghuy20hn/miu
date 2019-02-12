/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    $('#productcategories-parent_id').change(function () {
        var val = parseInt($(this).val());
        if (val > 0) {
            $.ajax({
                url: '/product-categories/type',
                type: 'get',
                data: {
                    id: val
                },
                success: function (data) {
                    data = parseInt(data);
                    if (data > 0) {
                        $('#productcategories-display_type option').each(function () {
                            var $this = $(this); // cache this jQuery object to avoid overhead
                            if (parseInt($this.val()) == data) { // if this option's value is equal to our value
                                $this.prop('selected', 'selected'); // select this option
                                $('#productcategories-display_type').prop('disabled', true);
                                return false; // break the loop, no need to look further
                            }
                        });
                    }
                }
            });
        } else {
            $('#productcategories-display_type').prop('disabled', false);
        }
    });

    $('#productcatuserattribute-type').change(function () {
        if (parseInt($(this).val()) == 2) {
            $('#productcatuserattribute-data').prop('disabled', false);
        } else {
            $('#productcatuserattribute-data').prop('disabled', true);
            $('#productcatuserattribute-data').val('');
        }
    });

    $('#videocategory-is_active').click(function () {
        if (!$(this).prop('checked')) {
            if (confirm("Deactive category thì toàn bộ video trong category cũng sẽ deactive\nBạn có chắc muốn thực hiện?")) {
                return true;
            } else {
                $(this).prop('checked', true);
                return;
            }
        }
    });

    $('#vtarticlecategories-is_active').click(function () {
        if (!$(this).prop('checked')) {
            if (confirm("Deactive danh mục thì toàn bộ tin tức trong danh mục cũng sẽ deactive\nBạn có chắc muốn thực hiện?")) {
                return true;
            } else {
                $(this).prop('checked', true);
                return;
            }
        }
    });
});



