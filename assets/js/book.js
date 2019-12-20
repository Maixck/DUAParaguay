/**
 * Created by Admin on 22/08/2019.
 */

var global_currentSlide = 1;
var global_minSlide = 1;
var global_maxSlide = 1;
var global_lang = 'spanish';
var global_simple = false;
var global_audio = false;
var global_senhas = false;
var global_scrolling = false;
var animation_speed = 400;
var is_play = false;
var stop_recursion = false;


var global_currentAudio = 1;
var audio_element = false;
var global_minAudio = 1;
var global_maxAudio = 0;

var audio_queue = [];

var contentOffset = 0;

var memoria = false;
var audio_assets_dir = 'assets/audio/';
var video_assets_dir = 'assets/video/';
var audio_extension = '.mp3';
var video_extension = '.mp4';

var text_slides = [4,10];

function goToSlide(slideNo){
    if(slideNo >= global_minSlide && slideNo <= global_maxSlide){
        $('html, body').stop().animate({scrollTop:$('#slide-'+slideNo).offset().top - contentOffset}, animation_speed, 'swing', function() {
            global_currentSlide = slideNo;
            global_scrolling = false;
            $('#var-slide_number').html(global_currentSlide);
            global_maxAudio = $('#slide-' + global_currentSlide).find('.js-read-auto').length;
            audio_queue = [];
            $('#slide-' + global_currentSlide).find('.js-read-auto').filter(':visible').each(function(){
                audio_queue.push($(this));
            });
            audio_queue.push('end');
            global_currentAudio = 1;
            $('.read-selected').removeClass('read-selected');
            if(audio_element){
                audio_element.pause();
                audio_element = false;
                var video = document.getElementById("video-ls");
                video.pause();
                video.currentTime = 0;
                if(is_play){
                    playNextAudio();
                }
            }else{
                if(is_play){
                    playNextAudio();
                }
            }
        });
    }else{
        setTimeout(function(){
            global_scrolling = false;
        },500);
    }
}

function getLangFilesPrefix(){
    var audioPrefix = '';
    switch (global_lang){
        case 'guarani':
            audioPrefix = 'gua-';
            break;
        case 'spanish':
            audioPrefix = '';
            break;
    }
    return audioPrefix;
}

function isRight(element){
    var data = element.data('is-right');
    return data === true;
}

function isExclusive(element){
    var data = element.data('is-exclusive');
    return data === true;
}

function startUp(){
    var counter = 0;
    $('.slide').each(function(){
        $(this).attr("id", 'slide-'+ ++counter);
    });
    global_maxSlide = counter;
    contentOffset = 96;


    setSimple(global_simple);
    setAudio(global_audio);
    setSenhas(global_senhas);
    setLang(global_lang);

    $('#var-last_slide_number').html(global_maxSlide);
    goToSlide(global_currentSlide);
}
function setSimple(setVal){
    if(setVal){
        $(".select-simple").fadeTo("fast", 1);
        global_simple = true;
        $('.simple-lang-on').fadeIn();
        $('.simple-lang-off').fadeOut();
    }else{
        $(".select-simple").fadeTo("fast", 0.3);
        global_simple = false;
        $('.simple-lang-on').fadeOut();
        $('.simple-lang-off').fadeIn();
    }
    goToSlide(global_currentSlide);
}
function setAudio(setVal){
    if(setVal){
        if(!is_play){
            $('#play-pause').click();
        }
        $(".select-audio").fadeTo("fast", 1);
        global_audio = true;
    }else{
        $(".select-audio").fadeTo("fast", 0.3);
        global_audio = false;
    }
    goToSlide(global_currentSlide);
}
function setSenhas(setVal){
    if(global_lang!='guarani'){
        if(setVal){
            if(!is_play){
                $('#play-pause').click();
            }

            $(".select-senhas").fadeTo("fast", 1);
            global_senhas = true;
            $("#video-column").fadeIn();
        }else{
            $(".select-senhas").fadeTo("fast", 0.3);
            global_senhas = false;
            $("#video-column").fadeOut();
        }
    }
    goToSlide(global_currentSlide);
}
function setLang(lang){
    switch (lang){
        case 'guarani':
            setSenhas(false);
            global_lang = 'guarani';
            $("#select-guarani").fadeTo("fast", 1);
            $("#select-spanish").fadeTo("fast", 0.3);
            $(".js-lang-controlled").each(function(){
                if($(this).hasClass('lang-spanish')){
                    $(this).hide();
                }else if($(this).hasClass('lang-guarani')) {
                    $(this).show();
                }else{
                    $(this).text($(this).data('lang-guarani'));
                }
            });
            break;
        case 'spanish':
            global_lang = 'spanish';
            $("#select-guarani").fadeTo("fast", 0.3);
            $("#select-spanish").fadeTo("fast", 1);
            $(".js-lang-controlled").each(function(){
                if($(this).hasClass('lang-spanish')){
                    $(this).show();
                }else if($(this).hasClass('lang-guarani')) {
                    $(this).hide();
                }else{
                    $(this).text($(this).data('lang-spanish'));
                }
            });
            break;
    }
    //alert('lang set = ' + global_lang);
}

function getCurrentSlide(){
    return $('#slide-' + global_currentSlide);
}

function UrlExistsAudio(url)
{
    audio = new Audio(url);
}

function UrlExistsVideo(url)
{
    audio = new Video(url);
}

function UrlExists(asd){
    return true;
}

// Auto read
function playNextAudio(){
    var video = document.getElementById("video-ls");
    if(audio_queue[0] === 'end'){
        if(audio_element){
            audio_element.play();
            video.play();
        }
        return;
    } //end condition

    if(audio_element) {
        audio_element.play();
        video.play();
    }else{
        //video
        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-' + global_currentAudio + video_extension;

        console.log(video);
        if(UrlExists(videoUrl)) {
            if((text_slides.includes(global_currentSlide) ) && global_currentAudio > 1  ) {

            }else{
                $(video).find('source').attr('src', videoUrl);
                video.load();
                video.play();
            }
        }

        // a
        var audioUrl;
        if(text_slides.includes(global_currentSlide) && global_simple){
            audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + '-ts' + audio_extension;
        }else{
            audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + audio_extension;
        }
        var audio;
        audio = new Audio(audioUrl);
        var localcurrentaudio = global_currentAudio;
        console.log(audio);
        audio.onerror = function(){
            audio_element.pause();
            var audio = new Audio(audio_assets_dir + 'slide-' + global_currentSlide + '/' + 'audio-' + localcurrentaudio + audio_extension);
            audio.play();
            audio_element = audio;
        };

        audio.play();
        audio_element = audio;
        console.log(audio_queue);
        var item = audio_queue.shift();
        var currentSlide = getCurrentSlide();
        var scrollableItem = currentSlide.find('.scrollable');
        if(scrollableItem.length > 0 && item.parents('.scrollable').length > 0){
        //if( - scrollableItem[0].scrollTop + item.position().top > 250)
            scrollableItem[0].scrollTop = item.position().top - scrollableItem.height()/2;
        }
        item.addClass('read-selected');
        audio_queue.push(item);
        global_currentAudio++;
            video.onended = function(){
                if(audio_element.paused){
                    item.removeClass('read-selected');
                    audio_element = false;
                    playNextAudio();
                }
            };
            audio_element.onended = function(){
                var video = document.getElementById("video-ls");
                if(video.currentTime == 0 || video.paused || !global_senhas || text_slides.includes(global_currentSlide)){
                    item.removeClass('read-selected');
                    audio_element = false;
                    playNextAudio();
                }
            };
    }
}

function playPreviousAudio(){
    var video = document.getElementById("video-ls");
    if(audio_element){
        audio_element.pause();
        audio_element = false;
        video.pause();
    }
    var itemAux = '';
    var last_element = audio_queue.pop();
    audio_queue.push(last_element);
    if( last_element === "end"){
        global_currentAudio = 1;
    }else{
        itemAux = audio_queue.pop();
        if(itemAux != 'end'){
            audio_queue.unshift(itemAux);
            global_currentAudio--;
            itemAux.removeClass('read-selected');
            itemAux = audio_queue.pop();
            if(itemAux != 'end'){
                audio_queue.unshift(itemAux);
                itemAux.removeClass('read-selected');
                global_currentAudio--;
            }else{
                audio_queue.push(itemAux);
                global_currentAudio = 1;
            }
        }else{
            audio_queue.push(itemAux);
        }
    }
    if(is_play)
        playNextAudio();
}

function skipAudio(){
    if(audio_element){
        audio_element.pause();
        audio_element = false;
        var itemAux = audio_queue[audio_queue.length -1 ];
        if(itemAux != 'end'){
            itemAux.removeClass('read-selected');
        }
    }
    if(is_play)
        playNextAudio();
}

function stopAudio(){
    // audio
    if(audio_element){
        audio_element.pause();
    }

    // video
    video = document.getElementById("video-ls");
    video.pause();
}

$(function() {


    //CONTROLS
    $(document).on( "click", "#next-slide", function(){
        goToSlide(global_currentSlide+1);
    });
    $(document).on( "click", "#prev-slide", function(){
        goToSlide(global_currentSlide-1);
    });
    $(document).on( "click", "#prev-slide", function(){
        goToSlide(global_currentSlide-1);
    });


    $(window).bind('mousewheel DOMMouseScroll', function(event){
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // scroll up
            if(global_scrolling == false){
                global_scrolling = true;
                goToSlide(global_currentSlide-1);
            }
        }
        else {
            // scroll down
            if(!global_scrolling){
                global_scrolling = true;
                goToSlide(global_currentSlide+1);
            }
        }
    });

    //SLIDE 1
    $(document).on( "click", "#select-spanish", function(){
        //goToSlide(global_currentSlide+1);
        setLang('spanish');
    });
    $(document).on( "click", "#select-guarani", function(){
        //goToSlide(global_currentSlide+1);
        setLang('guarani');
    });

    //SLIDE 2
    $(document).on( "click", ".select-simple", function(){
        setSimple(!global_simple);
    });
    $(document).on( "click", ".select-audio", function(){
        setAudio(!global_audio);
    });
    $(document).on( "click", ".select-senhas", function(){
        setSenhas(!global_senhas);
    });

    // SLIDE 3
    $("#area_nina").mouseenter(function (e) {
        $('#js-nina').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');
    });
    $("#area_nina").mouseleave(function (e) {
        $('#js-nina').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_nina").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 14' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-2' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });

    $("#area_arbol").mouseenter(function (e) {
        $('#js-arbol').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');

    });
    $("#area_arbol").mouseleave(function (e) {
        $('#js-arbol').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_arbol").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 10' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-3' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });

    $("#area_abejas").mouseenter(function (e) {
        $('#js-abejas').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');

    });
    $("#area_abejas").mouseleave(function (e) {
        $('#js-abejas').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_abejas").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 15' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-4' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });

    $("#area_arbustos").mouseenter(function (e) {
        $('#js-arbustos').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');

    });
    $("#area_arbustos").mouseleave(function (e) {
        $('#js-arbustos').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_arbustos").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 16' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-5' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });

    $("#area_flores").mouseenter(function (e) {
        $('#js-flores').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');

    });
    $("#area_flores").mouseleave(function (e) {
        $('#js-flores').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_flores").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 11' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-6' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });

    $("#area_cabana").mouseenter(function (e) {
        $('#js-cabana').css("opacity","0.6");
        $('.custom-animation-selector').removeClass('custom-animation-1');

    });
    $("#area_cabana").mouseleave(function (e) {
        $('#js-cabana').css("opacity","0");
        $('.custom-animation-selector').addClass('custom-animation-1');
    });
    $("#area_cabana").click(function (e) {
        var audio = new Audio(audio_assets_dir + 'mapa' + '/' + getLangFilesPrefix() + 'AUDIO 13' + audio_extension);
        audio.play();

        var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-7' + video_extension;
        $(video).find('source').attr('src', videoUrl);
        video.load();
        video.play();
    });


    $("#go-home").click(function (e) {
        goToSlide(1);
    });


    $(".scroll-up").click(function (e) {
        $(this).siblings('.scrollable').animate({
            scrollTop: '-=200px'
        });
    });

    $(".scroll-down").click(function (e) {
        $(this).siblings('.scrollable').animate({
            scrollTop: '+=200px'
        });
    });

    $('map').imageMapResize();

    // Ejercicio 1
    $(document).on( "click", ".js-ejercicio", function(){
        if(isExclusive($(this))){
            $(this).closest('.js-ejercicio-parent').find('.js-ejercicio').removeClass('ejercicio-correct').removeClass('ejercicio-incorrect');
        }
        if(isRight($(this))){
            $(this).addClass('ejercicio-correct');
            var audio = new Audio(audio_assets_dir + 'correcto2.mp3');
            audio.play();
        }else{
            $(this).addClass('ejercicio-incorrect');
            var audio = new Audio(audio_assets_dir + 'incorrecto.mp3');
            audio.play();
        }
    });



    // Clase 3, Ejercicio 3

    function dragMoveListener (event) {
        var target = event.target;
        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '.interact-ejercicio-3',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.5,

        // listen for drop related events:

        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget;
            var dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            //draggableElement.textContent = 'Dragged in';

            dropzoneElement.classList.remove('ejercicio-incorrect');
            dropzoneElement.classList.remove('ejercicio-correct');
            $(dropzoneElement).siblings('.img-correct').fadeOut();
            $(dropzoneElement).siblings('.img-incorrect').fadeOut();
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            //event.relatedTarget.textContent = 'Dragged out';
        },
        ondrop: function (event) {
            var draggableElement = event.relatedTarget;
            var dropzoneElement = event.target;

            if(dropzoneElement.dataset.order == draggableElement.dataset.order){
                dropzoneElement.classList.add('ejercicio-correct');
                $(dropzoneElement).siblings('.img-correct').fadeIn();
            }else{
                dropzoneElement.classList.add('ejercicio-incorrect');
                $(dropzoneElement).siblings('.img-incorrect').fadeIn();
            }
            //event.relatedTarget.textContent = 'Dropped';
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    interact('.interact-ejercicio-3')
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: '.info-cuento',
                    endOnly: true
                })
            ],
            autoScroll: true,
            // dragMoveListener from the dragging demo above
            onmove: dragMoveListener
        });



    // Ejercicio memoria



    // START UP
    startUp();

    function removeIncorrectClasses(element1, element2){
        element1.removeClass('ejercicio-incorrect');
        element2.removeClass('ejercicio-incorrect');

    }

    $(document).on( "click", ".js-ejercicio-memoria .js-ejercicio-item", function(){
        if(!$(this).hasClass('ejercicio-correct')){
            if(memoria){
                if($(this).hasClass('js-selected')){

                }else{
                    if($(this).find('img').attr('src') == memoria){
                        $(this).closest('.js-ejercicio-memoria').find('.js-selected').addClass('ejercicio-correct');
                        $(this).addClass('ejercicio-correct');
                        $(this).closest('.js-ejercicio-memoria').find('.js-selected').removeClass('js-selected')
                        memoria = false;
                    }else{
                        $(this).closest('.js-ejercicio-memoria').find('.js-selected').addClass('ejercicio-incorrect');
                        $(this).addClass('ejercicio-incorrect');
                        var element1 = $(this);
                        var element2 = $(this).closest('.js-ejercicio-memoria').find('.js-selected');
                         setTimeout(function(){
                             removeIncorrectClasses(element1, element2);
                        }, 1000);
                        $(this).closest('.js-ejercicio-memoria').find('.js-selected').removeClass('js-selected');
                        memoria = false;
                    }
                }
            }else{
                memoria = $(this).find('img').attr('src');
                $(this).addClass('js-selected');
            }
        }
    });


    // Auto read
    $(document).on( "click", "#prev-action", function(){
        playPreviousAudio();
    });

    $(document).on( "click", "#next-action", function(){
        skipAudio();
    });

    $(document).on( "click", "#play-pause", function(){
        if(is_play){
            $(this).find('.js-play').show();
            $(this).find('.js-pause').hide();
            stopAudio();
        }else{
            $(this).find('.js-play').hide();
            $(this).find('.js-pause').show();
            playNextAudio();
        }
        is_play = !is_play;
    });


    //botones control
    $(document).keydown(function(e) {
        switch(e.which) {
            case 32: // left
                $('#play-pause').click();
                break;

            case 37: // left
                $('#prev-slide').click();
                break;

            case 38: // up
                $('#prev-action').click();
                break;

            case 39: // right
                $('#next-slide').click();
                break;

            case 40: // down
                $('#next-action').click();
                break;

            case 74: // J
            case 106: // j
                $('.read-selected').click();
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    playNextAudio();
});