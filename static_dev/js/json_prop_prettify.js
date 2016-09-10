define(['jquery'], function($) {

    var _elem_spe, _prop_sep;

    _elem_spe = ',';
    _prop_sep = ':';

    function format_list_prop(json_str, prop_name_str) {
        var prop_length, prop_res, prop_start_pos, re;

        re = RegExp("\"" + prop_name_str + "\"\\s?:\\s?", 'g');

        prop_res = json_str.match(re);
        if (!prop_res) throw new Error('can not find porperty in json_str: [' + prop_name_str + ']');

        if (prop_name_str == "payouts") {
            console.log("debug");
        }

        //
        var open_strs, close_strs;
        var object_open_brace, object_close_brace;
        var array_open_brace, array_close_brace;

        object_open_brace = '{';
        object_close_brace = '}';
        array_open_brace = '[';
        array_close_brace = ']';

        open_strs = [object_open_brace, array_open_brace];
        close_strs = [object_close_brace, array_close_brace];

        prop_start_pos = 0;

        prop_res.forEach(function(p, pi, arr_p) {

            prop_length = p.length;

            prop_start_pos = json_str.indexOf(p, prop_start_pos) + prop_length;

            if ($.inArray(json_str[prop_start_pos], open_strs) == -1) {
                return;
            }

            //
            var prop_end_pos, prop_indent_start, prop_indent_length, i, cc;
            var tab_fix = 0;

            prop_indent_length = 0;
            for (i = prop_start_pos; i > 0; --i) {
                cc = json_str[i];
                if (cc == '\n') {
                    prop_indent_start = i;
                    break;
                } else if (cc == '\t') {
                    tab_fix += 1;
                }
            }

            var new_line_cond = { 'exit_scope': false, 'hit_sep': false, 'new_line': false };

            var scope_count, total_length;
            scope_count = 0;
            total_length = json_str.length;

            for (i = prop_start_pos; i < total_length; ++i) {
                cc = json_str[i];

                // check open braces
                if ($.inArray(cc, open_strs) != -1) {
                    scope_count += 1;

                    //if ( scope_count == 2 ) {
                    // enter scpoe of an array
                    if (new_line_cond.new_line) {
                        new_line_cond.new_line = false;

                        var indent_spaces = '';
                        for (var indent = 0; indent < prop_indent_length; ++indent) {
                            indent_spaces += ' ';
                        }
                        json_str = json_str.substring(0, i) + indent_spaces + json_str.substring(i);
                        total_length = json_str.length;
                        i = i + prop_indent_length;
                    }
                    //
                    if (prop_indent_length == 0) {
                        prop_indent_length = (i - prop_indent_start - tab_fix) + tab_fix * 4;
                    }
                    //}
                    continue;
                }
                // check close braces
                else if ($.inArray(cc, close_strs) != -1) {
                    //if ( scope_count == 2 ) {
                    //if ( cc == object_close_brace ) {
                    new_line_cond.exit_scope = true;
                    //}
                    scope_count -= 1;

                    if (scope_count == 0) {
                        close_index = i;
                        break;
                    } else {
                        continue;
                    }
                }

                //
                if (cc == '\n') {
                    if (new_line_cond.exit_scope && new_line_cond.hit_sep) {
                        new_line_cond.exit_scope = false;
                        new_line_cond.hit_sep = false;
                        new_line_cond.new_line = true;
                    } else if (new_line_cond.hit_sep) {
                        // replace '\n' to single space ' '
                        json_str = json_str.substring(0, i) + ' ' + json_str.substring(i + 1);
                        total_length = json_str.length;
                        new_line_cond.hit_sep = false;
                    } else {
                        // eliminate
                        json_str = json_str.substring(0, i) + json_str.substring(i + 1);
                        total_length = json_str.length;
                        i = i - 1;
                    }
                }
                //
                else if (cc == ' ' || cc == '\t') {
                    if (!new_line_cond.hit_sep ||
                        (new_line_cond.hit_sep && new_line_cond.exit_scope)) {
                        // eliminate
                        json_str = json_str.substring(0, i) + json_str.substring(i + 1);
                        total_length = json_str.length;
                        i = i - 1;
                    }
                    if (new_line_cond.hit_sep && !new_line_cond.exit_scope) {
                        new_line_cond.hit_sep = false;
                    }
                } else {
                    new_line_cond.hit_sep = (cc == _elem_spe);
                }
            }
        })

        return json_str;
    }


    //
    return {
        format_list_prop: format_list_prop,
    }
})