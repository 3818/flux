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
	loginVisible();
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
		$('.js-fx-lightobx--login').fadeIn('fast').css('display', 'flex');
		// $('#fx-login__user').focus();
		loginVisible();
	});

	$('.js-fx-lightbox__close').on('click', function(e){
		e.preventDefault();
		$('.js-fx-lightobx--login').fadeOut('fast');
		loginVisible();
	});
}

function panelInteraction() {
	if ( $('.fx-editor').hasClass('is-editing') ) {
		$('body').addClass('is-editing');
		var fxpanelHei	= parseInt( $('.fx-editor__panel').outerHeight() );
		$('body').css('padding-bottom', ''+fxpanelHei+'px');
		$('.fx-editor__panel, .fx-editor__logo').addClass('is-editing');
		setTimeout(function functionName() {
			$('.fx-lightbox__box--help').addClass('is-active');
		}, 200);
	} else {
		$('body').removeClass('is-editing');
		$('body').css('padding-bottom', '0px');
		$('.js-fx-editor__panel, .js-fx-editor__logo').removeClass('is-editing');
	}
}

function loginVisible() {
	if ( $('.fx-lightbox__box--login').is(':visible') ) {
		if ( $('.fx-lightbox__box--login').hasClass('is-active') ) {
			$('.fx-lightbox__box--login').removeClass('is-active');
		} else {
			$('.fx-lightbox__box--login').addClass('is-active');
		}
	}
	$('#fx-login__user').focus();
}

function editModeVisible() {
	// Only in edit mode
	if ( $('.fx-editor').is(':visible') ) {
		$('.fx-content a').on('click', function(e) {
			e.preventDefault();
		});
		$('.js-fx-logintrigger__button').hide();
		$('.fx-lightbox--help').show().css('display', 'flex');
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

function helpVisible() {
	if ( $('.fx-lightbox__box--help').is(':visible') ) {
		if ( $('.fx-lightbox__box--help').hasClass('.is-active') ) {
			$('.fx-lightbox__box--help').removeClass('.is-active');
		} else {
			$('.fx-lightbox__box--help').addClass('.is-active');
		}
	}
}

function triggerHelp() {
	$('.js-trigger-help').on('click', function(){
		$('.fx-lightbox--help').fadeToggle('fast');
		$('.fx-lightbox__box--help').toggleClass('is-active');
	});
}
