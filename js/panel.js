// Generated by CoffeeScript 1.6.3
(function() {
  var adjustBrightness, adjustHue, adjustSaturation, body, bulbsTpl, createBridgeUser, dashboardTpl, defaultState, doAjaxRequest, doEffect, effectsTpl, favoritesTpl, hueIP, hueUser, init, lightList, renderBulbs, renderDashboard, renderEffects, renderFavorites, screen, selectBulb, timer, title, turnDefault, turnDefaultAll, turnOff, turnOffAll, turnOn, turnOnAll;

  hueIP = null;

  hueUser = "huepaneluser";

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

  timer = false;

  createBridgeUser = function() {
    return $.ajax({
      url: 'http://' + hueIP + '/api',
      dataType: 'JSON',
      type: 'POST',
      data: '{"devicetype":"huepanel","username":"' + hueUser + '"}',
      processData: false,
      success: function(data) {
        console.log(data);
        if (!!data[0].error) {
          return alert('Press the button on your base station and then immediately refresh this page.');
        } else {
          localStorage.hueIP = hueIP;
          return renderDashboard();
        }
      }
    });
  };

  init = function() {
    if (localStorage.hueIP === void 0) {
      return $.getJSON('http://www.meethue.com/api/nupnp', function(data) {
        hueIP = data[0].internalipaddress;
        return createBridgeUser();
      });
    } else {
      hueIP = localStorage.hueIP;
      return renderDashboard();
    }
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
      $.getJSON("http://" + hueIP + '/api/' + hueUser + '/lights', function(res) {
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

  adjustBrightness = function() {
    var all_lights, elem, selected_lights;
    all_lights = $('.bulb-select');
    selected_lights = $('li.on');
    elem = $('.brightness-range');
    clearTimeout(timer);
    return timer = setTimeout(function() {
      var value;
      value = parseFloat(elem.val());
      if (selected_lights.length === all_lights.length) {
        return doAjaxRequest(0, {
          bri: value
        }, "group");
      } else {
        return selected_lights.each(function() {
          var id;
          id = $('a', this).data('id');
          return doAjaxRequest(id, {
            bri: value
          }, "light");
        });
      }
    }, 300);
  };

  adjustHue = function() {
    var all_lights, elem, selected_lights;
    all_lights = $('.bulb-select');
    selected_lights = $('li.on');
    elem = $('.hue-range');
    clearTimeout(timer);
    return timer = setTimeout(function() {
      var value;
      value = parseFloat(elem.val());
      if (selected_lights.length === all_lights.length) {
        return doAjaxRequest(0, {
          hue: value
        }, "group");
      } else {
        return selected_lights.each(function() {
          var id;
          id = $('a', this).data('id');
          return doAjaxRequest(id, {
            hue: value
          }, "light");
        });
      }
    }, 300);
  };

  adjustSaturation = function() {
    var all_lights, elem, selected_lights;
    all_lights = $('.bulb-select');
    selected_lights = $('li.on');
    elem = $('.saturation-range');
    clearTimeout(timer);
    return timer = setTimeout(function() {
      var value;
      value = parseFloat(elem.val());
      if (selected_lights.length === all_lights.length) {
        return doAjaxRequest(0, {
          sat: value
        }, "group");
      } else {
        return selected_lights.each(function() {
          var id;
          id = $('a', this).data('id');
          return doAjaxRequest(id, {
            sat: value
          }, "light");
        });
      }
    }, 300);
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
    }).on('change', '.brightness-range', function() {
      return adjustBrightness();
    }).on('change', '.hue-range', function() {
      return adjustHue();
    }).on('change', '.saturation-range', function() {
      return adjustSaturation();
    });
    return init();
  });

}).call(this);
