$(".toplevelcomment").hide();

$("#ajaxform").submit(function(e)
{
    var postData = $(this).serializeArray();
    var formURL = $(this).attr("action");
    var username = $('form')[0].username.value;
    var comment = $('form')[0].comment.value;
    var user = $('.post_comment .avatar img').attr('src').split('/').pop();

    $.ajax({
        url : formURL,
        type: "POST",
        data : postData,
        success:function(data, textStatus, jqXHR) {
            var user_details = $('#user_details'),
                avatar = user_details &&
                    user_details.attr('data-avatar') ||
                    'http://www.gravatar.com/avatar/' + user,
                display_name = user_details &&
                    user_details.attr('data-displayname') ||
                    username,
                author_link = user_details &&
                    'http://www.youtube.com/channel/' + user_details.attr('data-channelid') ||
                    'http://www.gravatar.com/'+user;

            $(".comments").prepend(''
                + '<div id="comment_' + data.id + '"class="comment group">'
                + '    <div class="avatar">'
                + '        <img src="' + avatar + '">'
                + '    </div>'
                + '    <div class="comment_box">'
                + '        <span class="date">a moment ago</span>'
                + '        <div class="comment_container">'
                + '            <a href="' + author_link + '" class="user">' + display_name + '</a>'
                + '            <br>'
                + '            <span>' + comment + '</span>'
                + '        </div>'
                + '    </div>'
                + '</div>'
                + '');
            $('form')[0].comment.value = '';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == 'Bad Request') {
                errorThrown = 'Please Login to post comment';
            }

            alert(errorThrown);
        }
    });

    e.preventDefault(); //STOP default action
    e.unbind(); //unbind. to stop multiple form submit.
});

show_more = function (page) {
    var page = page || 1,
        type,
        comment_array;

    isNaN(page) ? type = 'gamers_video' : type = 'gamers_articles';


    $('#linker').remove();


    $.get('/'+topic+'?type=' + type + '&page='+page, function (e) {


        type === 'gamers_video' ? comment_array = e.comments : comment_array = e;

        comment_array.forEach(function(comment) {
            $(".comments").append(get_comment_tpl(comment));
        });

        if(e.next_page_token) {
            show_more_link(e.next_page_token);
            return;
        }

        if ($('.comments .comment').size() < total_comments) {
            show_more_link(parseInt(page) + 1);
        }

    });
};

get_comment_tpl = function (comment) {
    var tpl = '<div class="comment group">'
            + '    <div class="avatar">'
            + '        <img src="'+comment.avatar+'">'
            + '    </div>'
            + '    <div class="comment_box">'
            + '        <span class="date">'+comment.display_date+'</span>'
            + '        <div class="comment_container">'
            + '            <a href="'+comment.username_link+'" class="user">'+comment.username+'</a>'
            + '            <br>'
            + '            <span>'+comment.comment+'</span>'
            +              get_reply_button_tpl (comment)
            + '        </div>'
            + '    </div>'
            + '</div>';
    return tpl;
}

get_reply_button_tpl = function (comment) {
    var tpl = '<br/>'
            + '<button id="repbtn_' + comment.comment_id + '" '
            + 'class="reply_loader unloaded" '
            + 'onClick=show_replies('
            + '"' + comment.comment_id +'",'
            + '"' + comment.video_id + '",'
            + '"' + comment.channel_id + '")>'
            + 'View ' + comment.reply_count + ' Replies';

    tpl += '</button>'
        + '<div id="' + comment.comment_id +'"'
        + 'class="comment_replies"></div>';

    return comment.reply_count > 0 ? tpl : '';
}

var show_replies = function (comment_id, video_id, channel_id) {
    var target = $(event.currentTarget);

    if(target.hasClass('unloaded')){
        target.removeClass('unloaded');
        target.addClass('loaded');
        target.addClass('showing');
        $.get(
            '/youtube/get_comments?video_id='+video_id+'&parent_id='+comment_id+'&channel_id='+channel_id,
            function (result) {
                result.forEach(function(comment) {
                    $("#"+comment_id).append(''
                        + '<div class="comment group">'
                        + '    <div class="avatar">'
                        + '        <img src="'+comment.avatar+'">'
                        + '    </div>'
                        + '    <div class="comment_box">'
                        + '        <div class="comment_container">'
                        + '        <span class="date">'+comment.display_date+'</span>'
                        + '            <a href="'+comment.username_link+'" class="user">'+comment.username+'</a>'
                        + '            <br>'
                        + '            <span>'+comment.comment+'</span>'
                        + '        </div>'
                        + '    </div>'
                        + '</div>');
                    $("#repbtn_"+comment_id).hide();
                });

                $("#"+comment_id).show();
            });
        target.text('Hide Replies');
        return;
    }

    if(target.hasClass('showing')) {
        target.text('Show Replies');
        $("#"+comment_id).hide();
        target.removeClass('showing');
        target.addClass('hiding');
        return;
    }

    if(target.hasClass('hiding') && target.hasClass('loaded')) {
        $("#"+comment_id).show();
        target.text('Hide Replies');
        target.removeClass('hiding');
        target.addClass('showing');
    }
};

show_more_link = function (page) {

    $('body').append("<button id='linker' onClick='show_more(\""+page+"\")'>Load More</button>")
}
