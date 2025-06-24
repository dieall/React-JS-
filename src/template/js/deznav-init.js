"use strict"

var dezSettingsOptions = {};

function getUrlParams(dParam) 
	{
		var dPageURL = window.location.search.substring(1),
			dURLVariables = dPageURL.split('&'),
			dParameterName,
			i;

		for (i = 0; i < dURLVariables.length; i++) {
			dParameterName = dURLVariables[i].split('=');

			if (dParameterName[0] === dParam) {
				return dParameterName[1] === undefined ? true : decodeURIComponent(dParameterName[1]);
			}
		}
	}
	/* Cookies Function */
	function setCookie(cname, cvalue, exhours) 
		{
			var d = new Date();
			d.setTime(d.getTime() + (30*60*1000)); /* 30 Minutes */
			var expires = "expires="+ d.toString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}

	function getCookie(cname) 
		{
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}

	function deleteCookie(cname) 
		{
			var d = new Date();
			d.setTime(d.getTime() + (1)); // 1/1000 second
			var expires = "expires="+ d.toString();
			//document.cookie = cname + "=1;" + expires + ";path=/";
			document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"+";path=/";
		}

	function deleteAllCookie(reload = true)
		{
			jQuery.each(themeOptionArr, function(optionKey, optionValue) {
					deleteCookie(optionKey);
			});
			if(reload){
				location.reload();
			}
		}
		
	/* Cookies Function END */	

/**
 * Deznav initialization script
 */
(function($) {
  "use strict";

  var dezSettings = {
    version: 'dark',
    layout: 'vertical',
    headerBg: 'color_1',
    navheaderBg: 'color_1',
    sidebarBg: 'color_1',
    sidebarStyle: 'full',
    sidebarPosition: 'fixed',
    headerPosition: 'fixed',
    containerLayout: 'full',
    direction: 'ltr'
  };

  new dezSettings();

  jQuery(document).ready(function() {
    // Theme switcher
    $('#theme_version').on('change', function() {
      $('body').attr('data-theme-version', this.value);
    });

    // Layout switcher
    $('#layout').on('change', function() {
      if(this.value === 'horizontal') {
        $('.deznav').addClass('horizontal-menu');
        $('.deznav').removeClass('vertical-menu');
      } else {
        $('.deznav').addClass('vertical-menu');
        $('.deznav').removeClass('horizontal-menu');
      }
    });

    // Sidebar style switcher
    $('#sidebar_style').on('change', function() {
      if(this.value === 'mini') {
        $('#main-wrapper').addClass('mini-sidebar');
      } else {
        $('#main-wrapper').removeClass('mini-sidebar');
      }
    });

    // Initialize metismenu for sidebar
    if(jQuery('#menu').length > 0) {
      $("#menu").metisMenu();
    }

    // Add active class to nav items based on url
    var current = window.location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
    $('#menu a').each(function() {
      var $this = $(this);
      if(current === "" || current === "admin" || current === "user") {
        // For home page
        if($this.attr('href').indexOf("index") !== -1 || $this.attr('href').indexOf("admin") !== -1) {
          $(this).addClass('mm-active');
          $(this).parents('.mm-collapse').addClass('mm-show');
          $(this).parents('li').addClass('mm-active');
        }
      } else {
        // For other pages
        if($this.attr('href').indexOf(current) !== -1) {
          $(this).addClass('mm-active');
          $(this).parents('.mm-collapse').addClass('mm-show');
          $(this).parents('li').addClass('mm-active');
        }
      }
    });

  });

})(jQuery);