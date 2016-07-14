$(document).keyup(function(e) {
	// Tecla ESC
	if (e.keyCode == 27) {
		// Oculta login
		if ( $(window).width() >= 768 ) {
			$('.js-fx-lightobx--login').fadeout('fast');
		} else {
			$('.js-fx-lightobx--login').hide();
		}
	}
});

$(document).ready(function(){

	hashEvents();
	triggerLogin();
	validationLogin();
	panelInteraction();
	editModeVisible();
	triggerHelp();
	demo();

});

function valemail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function validationLogin() {
	$('#fx-login js-fx-lightbox__close').on('click', function(){
		$('#fx-login .required, #fx-login .requiredother, #fx-login .fx-errormsg').removeClass('fx-val-error');
		$('#fx-login .fx-errormsg').slideUp('fast').html('');
	});

	$('#submitLogin').on('click', function(e){
		e.preventDefault();
		$('#fx-login .required, #fx-login .requiredother, #fx-login .fx-errormsg').removeClass('fx-val-error');
		$('#fx-login .fx-errormsg').slideUp('fast');

		if ( $('#fx-login__user').val() == '' && $('#fx-login__pass').val() == '' ) {
			$('#fx-login .fx-errormsg').addClass('fx-val-error').html('Enter your USERNAME and PASSWORD').slideDown('fast');
			$('#fx-login .required, #fx-login .requiredother').addClass('fx-val-error');
		}
		else if ( $('#fx-login__user').val() == '' )
		{
			$('#fx-login .fx-errormsg').addClass('fx-val-error').html('Enter your USERNAME').slideDown('fast');
			$('#fx-login .required').addClass('fx-val-error');
		}
		else if ( $('#fx-login__pass').val() == '' )
		{
			$('#fx-login .fx-errormsg').addClass('fx-val-error').html('Enter your PASSWORD').slideDown('fast');
			$('#fx-login .requiredother').addClass('fx-val-error');
		}
		else
		{
			// guaranteed access
			$('#fx-login').submit();
		}
	});
}

function hashEvents() {
	if ( window.location.hash == '#admin' ) {
		$('.js-fx-lightobx--login').fadeIn().css('display', 'flex');
		$('.js-fx-logintrigger__button').fadeIn();
		$('#fx-login__user').focus();
	}

	if ( window.location.hash == '#admin?trigger' ) {
		$('.js-fx-logintrigger__button').fadeIn('fast');
	}

	if ( window.location.hash == '#admin?error' ) {
		$('.js-fx-lightobx--login').fadeIn('fast').css('display', 'flex');
		$('.js-fx-logintrigger__button').fadeIn('fast');
		$('#fx-login__user').focus();
		$('#fx-login .fx-errormsg').addClass('fx-val-error').html('Invalid USERNAME and/or PASSWORD').slideDown('fast');
		$('#fx-login .required, #fx-login .requiredother').addClass('fx-val-error');
	}
}


function triggerLogin() {
	$('.js-fx-logintrigger__button').on('click', function(e){
		e.preventDefault();
		if ( $(window).width() >= 768 ) {
			$('.js-fx-lightobx--login').fadeIn('fast').css('display', 'flex');
		} else {
			$('.js-fx-lightobx--login').show().css('display', 'flex');
		}
	});

	$('.js-fx-lightbox__close').on('click', function(e){
		e.preventDefault();
		if ( $(window).width() >= 768 ) {
			$('.js-fx-lightobx--login').fadeOut('fast');
		} else {
			$('.js-fx-lightobx--login').hide();
		}
	});
}

function panelInteraction() {
	if ( $('.fx-editor').hasClass('editing') ) {
		$('body').addClass('editing');
		var fxpanelHei	= parseInt( $('.fx-editor').innerHeight() );
		$('body').css('padding-bottom', ''+fxpanelHei+'px');
		$('.fx-editor, .fx-editor__logo').addClass('editing');
	} else {
		$('body').removeClass('editing');
		$('body').css('padding-bottom', '0px');
		$('.js-fx-editor, .js-fx-editor__logo').removeClass('editing');
	}
}

function editModeVisible() {
	// Only in edit mode
	if ( $('.fx-editor').is(':visible') ) {
		$('.fx-content a').on('click', function(e) {
			e.preventDefault();
		});
		$('.js-fx-logintrigger__button').hide();
		$('.fx-lightbox--tour').show().css('display', 'flex');
	}
}

function demo() {
	if ( $('.fx-editor').is(':visible') ) {
		$('.flux-demoContainer__actions').hide();
		$('.flux-demotrigger--fixed').hide();
	} else {
		$('.flux-demoContainer__actions').show();
		$('.flux-demotrigger--fixed').show();
	}

	if ( $('.fx-demo').is(':visible') ) {
		$('.js-fx-logintrigger').hide();
		$('.js-fx-lightbox__description').show();
	} else {
		$('.js-fx-logintrigger').show();
		$('.js-fx-lightbox__description').hide();
	}
}

function triggerHelp() {
	$('.js-trigger-help').on('click', function(){
		$('.fx-lightbox--tour').fadeToggle('fast');
		$('.fx-lightbox__box--tour').toggleClass('is-zoomout');
	});
}
