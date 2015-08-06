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
            $(".comments").prepend(''
                + '<div class="comment group">'
                + '    <div class="avatar">'
                + '        <img src="http://www.gravatar.com/avatar/'+user+'">'
                + '    </div>'
                + '    <div class="comment_box">'
                + '        <span class="date">a moment ago</span>'
                + '        <div class="comment_container">'
                + '            <a href="http://www.gravatar.com/'+user+'" class="user">'+username+'</a>'
                + '            <br>'
                + '            <span>'+comment+'</span>'
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
    var page = page || 1;
    $('#linker').remove();

    console.log($(this));
    $.get('/'+topic+'?type=gamers_video'+'&page='+page, function (e) {
        e.forEach(function(comment) {
            $(".comments").append(''
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
        });

        if ($('.comments .comment').size() < total_comments) {
            show_more_link(page + 1);
        }

    });
};

var show_replies = function (comment_id, video_id, channel_id) {
    var target = $(event.currentTarget);

    if(target.hasClass('unloaded')){
        target.removeClass('unloaded');
        target.addClass('loaded');
        target.addClass('showing');
        $.get(
            '/youtube/get_comments?video_id='+video_id+'&parent_id='+comment_id+'&channel_id='+channel_id,
            function (result) {
                console.log(result);
                result.forEach(function(comment) {
                    console.log(comment.comment);
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
                        //$("#repbtn_"+comment_id).style.display = 'none';
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
    $('body').append("<button id='linker' onClick='show_more("+page+")'>Load More</button>")
}

show_more_link(2);
