// Generated by CoffeeScript 1.6.3
(function() {
  var body, bulbsTpl, dashboardTpl, defaultState, doAjaxRequest, doEffect, effectsTpl, favoritesTpl, hueIP, hueUser, lightList, renderBulbs, renderDashboard, renderEffects, renderFavorites, screen, selectBulb, title, turnDefault, turnDefaultAll, turnOff, turnOffAll, turnOn, turnOnAll;

  hueIP = "192.168.2.32";

  hueUser = "kellishaver";

  lightList = null;

  body = $('body');

  screen = $('#screen');

  title = $('header h1');

  bulbsTpl = $('#bulbs-tpl').html();

  dashboardTpl = $('#dashboard-tpl').html();

  effectsTpl = $('#effects-tpl').html();

  favoritesTpl = $('#favorites-tpl').html();

  defaultState = {
    alert: "none",
    hue: 14922,
    effect: "none",
    sat: 60,
    bri: 254,
    on: true
  };

  doAjaxRequest = function(id, object, type) {
    var url;
    if (type === "light") {
      url = "http://" + hueIP + '/api/' + hueUser + '/lights/' + id + '/state';
    } else if (type === "group") {
      url = "http://" + hueIP + '/api/' + hueUser + '/groups/' + id + '/action';
    }
    return $.ajax(url, {
      dataType: 'JSON',
      type: 'PUT',
      data: JSON.stringify(object),
      queue: true
    });
  };

  selectBulb = function(elem) {
    var item;
    item = $(elem);
    return item.parent().toggleClass("on");
  };

  renderBulbs = function() {
    var data;
    document.getElementById('screen').innerHTML = '';
    data = {
      "lights": []
    };
    screen.html(Mark.up(bulbsTpl, lightList));
    return title.text("Bulb Controls");
  };

  renderDashboard = function() {
    var data;
    document.getElementById('screen').innerHTML = '';
    if (lightList === null) {
      data = {
        "lights": []
      };
      $.getJSON("http://" + hueIP + '/api' + hueUser + '/lights', function(res) {
        var k, v;
        for (k in res) {
          v = res[k];
          data.lights.push({
            id: k,
            name: v.name,
            state: {}
          });
        }
        lightList = data;
        return screen.html(Mark.up(dashboardTpl, data));
      });
    } else {
      screen.html(Mark.up(dashboardTpl, lightList));
    }
    return title.text("Hue Control Panel");
  };

  renderEffects = function() {
    document.getElementById('screen').innerHTML = '';
    screen.html(Mark.up(effectsTpl, lightList));
    return title.text("Special Effects");
  };

  renderFavorites = function() {
    var data;
    document.getElementById('screen').innerHTML = '';
    data = {
      favorites: []
    };
    screen.html(Mark.up(favoritesTpl));
    return title.text("Favorites");
  };

  doEffect = function(type) {
    var all_lights, clBtn, hue, selected_lights;
    all_lights = $('.bulb-select');
    selected_lights = $('li.on');
    hue = Math.floor(Math.random() * 65536);
    if (selected_lights.length === all_lights.length) {
      if (type === "cleareffects") {
        return doAjaxRequest(0, defaultState, "group");
      } else if (type === "colorloop") {
        clBtn = $('.color-loop');
        clBtn.toggleClass("is-on");
        if (clBtn.hasClass("is-on")) {
          return doAjaxRequest(0, {
            effect: "colorloop"
          }, "group");
        } else {
          return doAjaxRequest(0, {
            effect: "none"
          }, "group");
        }
      } else if (type === "flash30") {
        return doAjaxRequest(0, {
          alert: "lselect"
        }, "group");
      } else if (type === "flashonce") {
        return doAjaxRequest(0, {
          alert: "select"
        }, "group");
      } else if (type === "randomcolor") {
        return doAjaxRequest(0, {
          hue: hue
        }, "group");
      }
    } else {
      return selected_lights.each(function() {
        var id;
        id = $('a', this).data('id');
        if (type === "cleareffects") {
          return doAjaxRequest(id, defaultState, "light");
        } else if (type === "colorloop") {
          clBtn = $('.color-loop');
          clBtn.toggleClass("is-on");
          if (clBtn.hasClass("is-on")) {
            return doAjaxRequest(id, {
              effect: "colorloop"
            }, "light");
          } else {
            return doAjaxRequest(id, {
              effect: "none"
            }, "light");
          }
        } else if (type === "flash30") {
          return doAjaxRequest(id, {
            alert: "lselect"
          }, "light");
        } else if (type === "flashonce") {
          return doAjaxRequest(id, {
            alert: "select"
          }, "light");
        } else if (type === "randomcolor") {
          return doAjaxRequest(id, {
            hue: hue
          }, "light");
        }
      });
    }
  };

  turnDefault = function(id) {
    return doAjaxRequest(id, defaultState, "light");
  };

  turnDefaultAll = function() {
    return doAjaxRequest(0, defaultState, "group");
  };

  turnOff = function(id) {
    return doAjaxRequest(id, {
      on: false
    }, "light");
  };

  turnOffAll = function() {
    return doAjaxRequest(0, {
      on: false
    }, "group");
  };

  turnOn = function(id) {
    return doAjaxRequest(id, {
      on: true
    }, "light");
  };

  turnOnAll = function() {
    return doAjaxRequest(0, {
      on: true
    }, "group");
  };

  jQuery(function() {
    body.on('click', 'a', function(e) {
      return e.preventDefault();
    }).on('touchstart', 'a, button', function() {
      return $(this).addClass('touched');
    }).on('touchend', 'a, button', function() {
      return $(this).removeClass('touched');
    }).on('click', '.bulb-select', function() {
      return selectBulb(this);
    }).on('click', '.bulbs', function() {
      return renderBulbs();
    }).on('click', '.dashboard', function() {
      return renderDashboard();
    }).on('click', '.effects', function() {
      return renderEffects();
    }).on('click', '.favorites', function() {
      return renderFavorites();
    }).on('click', '.turn-default', function() {
      return turnDefault($(this).data('id'));
    }).on('click', '.turn-off', function() {
      return turnOff($(this).data('id'));
    }).on('click', '.turn-on', function() {
      return turnOn($(this).data('id'));
    }).on('click', '.all-default', function() {
      return turnDefaultAll();
    }).on('click', '.all-off', function() {
      return turnOffAll();
    }).on('click', '.all-on', function() {
      return turnOnAll();
    }).on('click', '.clear-effects', function() {
      return doEffect('cleareffects');
    }).on('click', '.color-loop', function() {
      return doEffect('colorloop');
    }).on('click', '.flash-30', function() {
      return doEffect('flash30');
    }).on('click', '.flash-once', function() {
      return doEffect('flashonce');
    }).on('click', '.random-color', function() {
      return doEffect('randomcolor');
    });
    return renderDashboard();
  });

}).call(this);
