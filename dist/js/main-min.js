function init(){prepareLyrics(),$("html").keydown(function(e){("a"===e.key||"A"===e.key)&&resetPoetry(),("b"===e.key||"B"===e.key)&&blackoutPoetry(),("c"===e.key||"C"===e.key)&&randomizePoetry()}),$(window).on("touchmove",function(e){var t=e.touches[0].clientX,n=e.touches[0].clientY;isTouchWithinBounds(t,n)&&(blackoutWord($(getTouchedElement(t,n))),prepareTweet())}),$("span").on("mouseenter",function(){blackoutWord($(this)),prepareTweet()}),$(".image-btn").click(function(e){$(".ui").hide(),html2canvas(document.body,{onrendered:function(e){var t=e.toDataURL();window.location.href=t}}),e.preventDefault()})}function isTouchWithinBounds(e,t){return null!==document.elementFromPoint(e,t)?"SPAN"===document.elementFromPoint(e,t).nodeName?!0:!1:void 0}function getTouchedElement(e,t){return document.elementFromPoint(e,t)}function blackoutWord(e){$(".add-blackout").is(":checked")?e.addClass("blacked-out"):e.removeClass("blacked-out")}function prepareTweet(){var e="";$(".lyrics-result span:not(.blacked-out)").each(function(){e+=$(this).text()+" ",$(this).hasClass("end-word")&&(e+="\n")});var t="https://twitter.com/share?url=https%3A%2F%2Fmusicasaverb.com&via=lowficoncerts&hashtags=musicasaverb";$(".tweet-btn").attr("href",t+"&text="+e)}function resetPoetry(){$(".lyrics-result span").removeClass("blacked-out")}function blackoutPoetry(){$(".lyrics-result span").addClass("blacked-out")}function randomizePoetry(){for(var e=$(".lyrics-result span").length,t=0;10>t;t++){var n=Math.floor(Math.random()*e);$(".lyrics-result span").eq(n).addClass("blacked-out")}}function prepareLyrics(){lyric=lyric.split("\n");for(var e="",t=0;t<lyric.length;t++)for(var n=lyric[t].split(" "),o=0;o<n.length;o++)o===n.length-1?(e+='<span class="end-word">'+n[o]+"</span> ",e+="<br>"):e+="<span>"+n[o]+"</span> ";$(".lyrics-result").html(e)}function sendToPath(e,t,n,o,r){var a=r||o,s={url:t,type:e,data:n,success:function(e){a(void 0,e)},error:function(e){a(e.responseJSON?e.responseJSON:{status:1,message:"Action failed, please try again later"})}};r&&(s.xhr=function(){var e=new window.XMLHttpRequest;return e.upload&&e.upload.addEventListener("progress",function(e){if(e.lengthComputable){var t=e.loaded/e.total;o(t)}},!1),e}),$.ajax(s)}var lyric="";$(document).ready(function(){sendToPath("get","/lyric",{},function(e,t){e?(lyric=e.message,console.log(e.message)):lyric=t,init()})});