var lyric = "";

$(document).ready(function() {

	sendToPath('get', '/lyric', {}, function (error, response) {
        if(!error) {
        	lyric = response;
        }
        else {
        	lyric = error.message;
        	console.log(error.message);
        }
        init();
    });
});

function init() {
	prepareLyrics();

	$('html').keydown(function(e) {
		// If press A
		if(e.key === "a" || e.key === "A") {
			resetPoetry();
		}

		if(e.key === "b" || e.key === "B") {
			blackoutPoetry();
		}

		if(e.key === "c" || e.key === "C") {
			randomizePoetry();
		}
	});

	$(window).on('touchmove', function(e) {
		var touchX = e.touches[0].clientX,
			touchY = e.touches[0].clientY;

		if(isTouchWithinBounds(touchX, touchY)) {
			blackoutWord( $( getTouchedElement(touchX, touchY) ) );
			prepareTweet();
		}
	})

	$('span').on('mouseenter', function() {
		blackoutWord($(this));
		prepareTweet();
	});

	$('.image-btn').click(function(e) {
		$('.ui').hide();
		html2canvas(document.body, {
			onrendered: function(canvas) {
				var dataUrl = canvas.toDataURL('image/png');
				var imgName = 'BlackoutPoetry_' + Math.floor(Math.random() * 2000).toString() + '.png'
    
			    var element = document.createElement('a');
			    element.setAttribute('href', dataUrl);
			    element.setAttribute('download', imgName);

			    element.style.display = 'none';
			    document.body.appendChild(element);
			  
			    element.click();

			    document.body.removeChild(element);
			    $('.ui').show();
			}
		});
		e.preventDefault();
	});
}

function isTouchWithinBounds(x, y) {
	if(document.elementFromPoint(x, y) !== null) {
		if (document.elementFromPoint(x, y).nodeName === 'SPAN') {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return
	}
}

function getTouchedElement(x, y) {
	return document.elementFromPoint(x, y);
}

function blackoutWord(elem) {
	if($('.add-blackout').is(':checked')) {
		elem.addClass('blacked-out');
	}
	else {
		elem.removeClass('blacked-out');
	}
}

function prepareTweet() {
	var tweetTxt = '';
	$('.lyrics-result span:not(.blacked-out)').each(function() {
		tweetTxt += $(this).text() + ' ';
		if($(this).hasClass('end-word')) {
			tweetTxt += '\n';
		}
	});

	var tweetUrl = 'https://twitter.com/share?url=https%3A%2F%2Fmusicasaverb.com&via=lowficoncerts&hashtags=musicasaverb';
	$('.tweet-btn').attr('href', tweetUrl + '&text=' + tweetTxt);
}

function resetPoetry() {
	$('.lyrics-result span').removeClass('blacked-out');
}

function blackoutPoetry() {
	$('.lyrics-result span').addClass('blacked-out');
}

function randomizePoetry() {
	var wordCount = $('.lyrics-result span').length;

	for(var i = 0; i < 10; i++) {
		var rand = Math.floor(Math.random() * wordCount);
		$('.lyrics-result span').eq(rand).addClass('blacked-out');
	}
}

function prepareLyrics() {
	lyric = lyric.split('\n');
	var newLyrics = '';

	for(var i = 0; i < lyric.length; i++) {
		var lyrics = lyric[i].split(' ');
		for(var j = 0; j < lyrics.length; j++) {
			if(j === lyrics.length - 1) {
				newLyrics += '<span class="end-word">' + lyrics[j] + '</span> ';
				newLyrics += '<br>';
			}
			else {
				newLyrics += '<span>' + lyrics[j] + '</span> ';
			}
		}
	}
	$('.lyrics-result').html(newLyrics);
}

/*
 * Send to route
 *
 */
function sendToPath(method, path, data, progress, done) {

    var callback = done || progress;

    var options = {
        url      : path,
        type     : method,
        data     : data,
        success  : function (body) {
            callback(undefined, body);
        },
        error    : function (body) {
            if(body.responseJSON) {
                callback(body.responseJSON);
            } else {
                callback({
                    status: 1,
                    message: "Action failed, please try again later"
                })
            }
        }
    };

    // If a progress callback is specified, add event listener if possible
    if (done) {
        options.xhr = function () {
            var xhr = new window.XMLHttpRequest();

            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var percent = e.loaded / e.total;
                        progress(percent);
                    }
                }, false);
            }
            return xhr;
        }
    }
    $.ajax(options);
}