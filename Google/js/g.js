
(function($) {
  $.localize = function(pkg, options) {
  };
  $.fn.localize = $.localize;
  $.localize.data = {};
})(jQuery);
// QueryString Engine v1.0.1 (modified)
// By James Campbell (modified by coderifous)
(function($) {
  $.querystringvalues = $.queryStringValues = $.QueryStringValues = $.QueryStringvalues = $.queryStringValues = $.queryStringvalues = $.querystringValues = $.getqueryString = $.queryString = $.querystring = $.QueryString = $.Querystring = $.getQueryString = $.getquerystring = $.getQuerystring  = function(options)
  {
    defaults = { defaultvalue: null };
    options = $.extend(defaults , options);
    qs = location.search.substring(1, location.search.length);
    if (qs.length == 0) return options.defaultvalue;
      qs = qs.replace(/\+/g, ' ');
      var args = qs.split('&');
      for (var i = 0; i < args.length; i ++ )
      {
        var value;
        var pair = args[i].split('=');
        var name = gentlyDecode(pair[0]);

      if (pair.length == 2)
      {
        value = gentlyDecode(pair[1]);
      }
      else
      {
        value = name;
      }
      if (name == options.id || i == options.id-1)
      {
          return value;
      }
      }
    return options.defaultvalue;
  };
})(jQuery);

$.fn.centerOver = function(element, topOffset, leftOffset) {
  topOffset = topOffset || 0;
  leftOffset = leftOffset || 0;
  var self = this;
  self.css({
    top: (element.position().top + element.outerHeight()/2 - self.height()/2 + topOffset).px(),
    left: (element.position().left + element.outerWidth()/2 - self.width()/2 + leftOffset).px()
  });
  return self;
};

$.fn.sponsor = function(programFile, callback) {
  var self = this;
  $.getJSON(programFile, function(program) {
    var sponsor = program.slots[rand(program.slots.length)];
    var id = sponsor.id;
    var anchor = self.find("a");
    anchor.attr("href", sponsor.url);
    anchor.find("img").attr("src", sponsor.image);
    anchor.find("p").html(sponsor.message);
    if (pageTracker) {
      pageTracker._trackPageview("/sponsor/" + id);
      anchor.unbind("click");
      anchor.click(function() { pageTracker._trackPageview("/outgoing/sponsor/" + id); });
    }
    if (callback) callback.call(self);
  });
  return self;
};

function rand(max) {
  return Math.floor(Math.random() * max);
}

Number.prototype.px = function(){ return this.toString() + "px"; };

function gentlyEncode(string) {
  return ( encodeURIComponent
           ? encodeURIComponent(string).replace(/%20(\D)?/g, "+$1").replace(/'/g, escape("'"))
           : escape(string).replace(/\+/g, "%2B").replace(/%20/g, "+") );
}

function gentlyDecode(string) {
  return decodeURIComponent ? decodeURIComponent(string) : unescape(string);
}
// default lang necessities
$.localize.data.lmgtfy = {
  setup: {
    type_question: "Введи запрос и нажми кнопку поиска",
    share_link:    "Поделитесь ссылкой:",
    or:            "или"
  },

  play: {
    step_1: "Шаг 1. Введите запрос.",
    step_2: "Шаг 2. Нажмите кнопку.",
    pwnage: 'Разве это так трудно?',
    nice:   'Это просто!'
  },

  link: {
    creating:  "Создание...",
    fetching:  "	Извлечение...",
    shortened: "Cсылка скопирована в буфер обмена"
  }
};

$(function(){
  initializeAboutLink();
  initializeControls();

  var searchString = $.getQueryString({ id: "q" });
  var inputField   = $("input[type=text]:first");
  var fakeMouse    = $("#fake_mouse");
  var instructions = $("#instructions > div");
  var button       = ($.getQueryString({ id: "l" }) == "1") ? $("#lucky") : $("#search");
  var inputLink    = $("#link input.link");
  var linkButtons  = $("#link_buttons");
  var linkMessage  = $("#link_message");

  if (searchString)
    googleItForThem();
  else
    getTheSearchTerms();

  function initializeAboutLink() {
    $("#showabout").click(function() {
      $("#about").toggle();
      $('html,body').animate({ scrollTop: $("#about").offset().top }, 1000);
      return false;
    });
  }

  function initializeControls() {
    $('input.copyable').click(function() { $(this).select(); });
    $("#go").click(function(){ window.location = inputLink.val(); return false; });
    $("#reset").click(function(){ showTheUrl($(this).attr("url")); return false; });
    $("#copy").click(function(){ copyToClipboard() });
	
	
    $("#tiny").click(function(){
      linkStatus("link.fetching", 0, true);
      $.getJSON("//api-ssl.bitly.com/v3/shorten?format=json&login=gikteam&apiKey=R_b845734d6720ee83be40b09dd6608985&longUrl=" + gentlyEncode(inputLink.val()), function(e) {
        inputLink.val(e.data.url).focus().select();
        linkStatus("link.fetching", 2500);
      });
      $(this).hide();
      $("#reset").show();
      return false;
    });
  }
  
  function copyToClipboard() {
    var $temp = $("<input>");
	var $dcp = $( "#p1" ).val();
    $("body").append($temp);
    $temp.val($dcp).select();
    document.execCommand("copy");
    $temp.remove();
	linkStatus("link.shortened", 3500);
  }

  function langString(langkey) {
    var keys = langkey.split(/\./);
    return keys.length == 1 ? $.localize.data.lmgtfy[keys[0]] : $.localize.data.lmgtfy[keys[0]][keys[1]];
  }

  function instruct(langkey) {
    instructions.html(langString(langkey));
  }

  function linkStatus(langkey, millis, stuck) {
    millis = millis || 2500;
    linkMessage.html(langString(langkey)).show().centerOver(inputLink);
    if (!stuck) {
      setTimeout(function(){ linkMessage.fadeOut(millis/4*3); }, millis/4);
    }
  }

  function getTheSearchTerms() {
   // $("#sponsor").sponsor("/s/program.json", function() { this.fadeIn(1000); });
    $("form").submit(function(){ $("#search").click(); return false; });
    instruct("setup.type_question");
    inputField.focus().select();

    $(".button-default").click(function(e){
      instruct("setup.share_link");

      var l   = window.location;
      var url = l.protocol + "//" + l.hostname + l.pathname + "?";

      strings = [ "q=" + gentlyEncode(inputField.val()) ];
      if (this.id == "lucky") strings.push("l=1");

      url += strings.join("&");

      showTheUrl(url);
    });
  }

  function showTheUrl(url) {
	linkButtons.fadeIn("fast");
    $("#link").centerOver($("#link_placeholder")).show();
    $("#reset").attr("url", url).hide();
    $("#tiny").show();

    linkStatus("link.creating", 1500);
    inputLink.val(url).focus().select();
    linkButtons.centerOver(inputLink, 28);
  }

  function googleItForThem() {
    if ($.getQueryString({ id: "fwd" })) redirect();

    $("body").css("cursor", "wait");
    fakeMouse.show();
    instruct("play.step_1");

    fakeMouse.animate({
      top:  (inputField.position().top  + 15).px(),
      left: (inputField.position().left + 10).px()
    }, 1500, 'swing', function(){
      inputField.focus();
      fakeMouse.animate({ top: "+=0px", left: "+=0px" }, 'fast', function() { fixSafariRenderGlitch(); });
      type(searchString, 0);
    });

    function type(string, index){
      var val = string.substr(0, index + 1);
      inputField.attr('value', val);
      if (index < string.length) {
        setTimeout(function(){ type(string, index + 1); }, Math.random() * 240);
      }
      else {
        doneTyping();
      }
    }
	
    function doneTyping(){
      instruct("play.step_2");
      fakeMouse.animate({
        top:  (button.position().top  + 20).px(),
        left: (button.position().left + 30).px()
      }, 2000, 'swing', function(){
        var key = $.getQueryString({ id: "l" }) == 1 ? "play.nice" : "play.pwnage";
        instruct(key);
        button.focus();
        setTimeout(redirect, 6000);
      });
    }

    function redirect(){
      if ($.getQueryString({ id: "debug" })) return;

      var google = "//www.google.ru/search?&rls=ru&q=";
      if (button.attr("id") == $("#lucky").attr("id")) {
        google = "//www.google.ru/search?hl=ru&btnI=I%27m+Feeling+Lucky&q=";
      }

      window.location = google + gentlyEncode(searchString);
    }

    function fixSafariRenderGlitch() {
     // if ($.browser.safari) inputField.blur().focus();
    }
  }
});
