hueIP         = "192.168.2.32"
hueUser       = "kellishaver"

lightList     = null

body          = $ 'body'
screen        = $ '#screen'
title         = $ 'header h1'

bulbsTpl      = $('#bulbs-tpl').html()
dashboardTpl  = $('#dashboard-tpl').html()
effectsTpl    = $('#effects-tpl').html()
favoritesTpl  = $('#favorites-tpl').html()

defaultState = {
  alert: "none",
  hue: 14922,
  effect: "none",
  sat: 60,
  bri: 254,
  on: true
}

# AJAX request to control a light or group.
doAjaxRequest = (id, object, type) ->
  if type == "light"
    url = "http://" + hueIP + '/api' + hueUser + '/lights/' + id + '/state'
  else if type == "group"
    url = "http://" + hueIP + '/api' + hueUser + '/groups/' + id + '/action'

  $.ajax url,
    dataType: 'JSON'
    type: 'PUT'
    data: JSON.stringify object
    queue: true


# General Purpose
selectBulb = (elem) ->
  item = $ elem
  item.parent().toggleClass "on"

# Render the screens
renderBulbs = () ->
  document.getElementById('screen').innerHTML = '';
  data = { "lights" : [] }
  screen.html Mark.up(bulbsTpl, lightList)
  title.text "Bulb Controls"

renderDashboard = () ->
  document.getElementById('screen').innerHTML = '';
  if lightList == null
    data = { "lights" : [] }
    $.getJSON "http://" + hueIP + '/api' + hueUser + '/lights', (res) ->
      for k,v of res
        data.lights.push { id: k, name: v.name, state: {} }
      lightList = data
      screen.html Mark.up(dashboardTpl, data)
  else
    screen.html Mark.up(dashboardTpl, lightList)
  title.text "Hue Control Panel"

renderEffects = () ->
  document.getElementById('screen').innerHTML = '';
  screen.html Mark.up(effectsTpl, lightList)
  title.text "Special Effects"

renderFavorites = () ->
  document.getElementById('screen').innerHTML = '';
  data = { favorites: [] }
  screen.html Mark.up(favoritesTpl)
  title.text "Favorites"


# Special Effects
doEffect = (type) ->
  all_lights        = $ '.bulb-select'
  selected_lights   = $ 'li.on'
  hue               = Math.floor Math.random() * 65536

  if selected_lights.length == all_lights.length
    if type == "cleareffects"
      doAjaxRequest 0, defaultState, "group"
    else if type == "colorloop"
      clBtn = $ '.color-loop'
      clBtn.toggleClass "is-on"
      if clBtn.hasClass "is-on"
        doAjaxRequest 0, {effect: "colorloop"}, "group"
      else
        doAjaxRequest 0, {effect: "none"}, "group"
    else if type == "flash30"
      doAjaxRequest 0, {alert: "lselect"}, "group"
    else if type == "flashonce"
      doAjaxRequest 0, {alert: "select"}, "group"
    else if type == "randomcolor"
      doAjaxRequest 0, {hue: hue}, "group"

  else
    selected_lights.each ->
      id = $('a', this).data 'id'
      if type == "cleareffects"
        doAjaxRequest id, defaultState, "light"
      else if type == "colorloop"
        clBtn = $ '.color-loop'
        clBtn.toggleClass "is-on"
        if clBtn.hasClass "is-on"
          doAjaxRequest id, {effect: "colorloop"}, "light"
        else
          doAjaxRequest id, {effect: "none"}, "light"
      else if type == "flash30"
        doAjaxRequest id, {alert: "lselect"}, "light"
      else if type == "flashonce"
        doAjaxRequest id, {alert: "select"}, "light"
      else if type == "randomcolor"
        doAjaxRequest id, {hue: hue}, "light"

# Dashboard Controls
turnDefault = (id) ->
  doAjaxRequest id, defaultState, "light"

turnDefaultAll = () ->
  doAjaxRequest 0, defaultState, "group"

turnOff = (id) ->
  doAjaxRequest id, {on: false}, "light"

turnOffAll = () ->
  doAjaxRequest 0, {on: false}, "group"

turnOn = (id) ->
  doAjaxRequest id, {on: true}, "light"

turnOnAll = () ->
  doAjaxRequest 0, {on: true}, "group"

jQuery ->

  body.on 'click', 'a', (e) ->
    e.preventDefault();
  .on 'touchstart', 'a, button', ->
    $(this).addClass 'touched'
  .on 'touchend', 'a, button', ->
    $(this).removeClass 'touched'
  .on 'click', '.bulb-select', ->
    selectBulb(this)
  .on 'click', '.bulbs', ->
    renderBulbs()
  .on 'click', '.dashboard', ->
    renderDashboard()
  .on 'click', '.effects', ->
    renderEffects()
  .on 'click', '.favorites', ->
    renderFavorites()
  .on 'click', '.turn-default', ->
    turnDefault $(this).data 'id'
  .on 'click', '.turn-off', ->
    turnOff $(this).data 'id'
  .on 'click', '.turn-on', ->
    turnOn $(this).data 'id'
  .on 'click', '.all-default', ->
    turnDefaultAll()
  .on 'click', '.all-off', ->
    turnOffAll()
  .on 'click', '.all-on', ->
    turnOnAll()
  .on 'click', '.clear-effects', ->
    doEffect 'cleareffects'
  .on 'click', '.color-loop', ->
    doEffect 'colorloop'
  .on 'click', '.flash-30', ->
    doEffect 'flash30'
  .on 'click', '.flash-once', ->
    doEffect 'flashonce'
  .on 'click', '.random-color', ->
    doEffect 'randomcolor'

  # Load the Dashboard
  renderDashboard()
