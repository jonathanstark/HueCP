hueIP         = null
hueUser       = "huepaneluser"

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

timer = false

# Initial Setup
createBridgeUser = () ->
  $.getJSON "http://" + hueIP + '/api/' + hueUser + '/lights', (res) ->
    if !!res[0]
      $.ajax
        url: 'http://' + hueIP + '/api',
        dataType: 'JSON',
        type: 'POST',
        data: '{"devicetype":"huepanel","username":"' + hueUser + '"}',
        processData : false,
        success: (data) ->
          if !!data[0].error
            alert 'Press the button on your base station and then immediately refresh this page.'
          else
            localStorage.hueIP = hueIP
            renderDashboard();
    else
      localStorage.hueIP = hueIP
      renderDashboard();

init = () ->
  if localStorage.hueIP == undefined
    # Get the IP of the bridge from the hue bridge API
    $.getJSON 'http://www.meethue.com/api/nupnp', (data) ->
      # TODO: Create UI to clear stored IP address
      # TODO: Create UI to select from multiple bridges
      # TODO: Move createBridgeUser logic to ajax error handlers instead of on first init
      hueIP = data[0].internalipaddress
      createBridgeUser()
  else
    hueIP = localStorage.hueIP
    renderDashboard()

# AJAX request to control a light or group.
doAjaxRequest = (id, object, type) ->
  if type == "light"
    url = "http://" + hueIP + '/api/' + hueUser + '/lights/' + id + '/state'
  else if type == "group"
    url = "http://" + hueIP + '/api/' + hueUser + '/groups/' + id + '/action'

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
    $.getJSON "http://" + hueIP + '/api/' + hueUser + '/lights', (res) ->
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

# Bulb Controls
adjustBrightness = () ->
  all_lights        = $ '.bulb-select'
  selected_lights   = $ 'li.on'
  elem              = $ '.brightness-range'

  clearTimeout timer
  timer = setTimeout () ->
    value = parseFloat elem.val()
    if selected_lights.length == all_lights.length
      doAjaxRequest 0, {bri: value}, "group"
    else
      selected_lights.each ->
        id = $('a', this).data 'id'
        doAjaxRequest id, {bri: value}, "light"
  , 300

adjustHue = () ->
  all_lights        = $ '.bulb-select'
  selected_lights   = $ 'li.on'
  elem              = $ '.hue-range'

  clearTimeout timer
  timer = setTimeout () ->
    value = parseFloat elem.val()
    if selected_lights.length == all_lights.length
      doAjaxRequest 0, {hue: value}, "group"
    else
      selected_lights.each ->
        id = $('a', this).data 'id'
        doAjaxRequest id, {hue: value}, "light"
  , 300

adjustSaturation = () ->
  all_lights        = $ '.bulb-select'
  selected_lights   = $ 'li.on'
  elem              = $ '.saturation-range'

  clearTimeout timer
  timer = setTimeout () ->
    value = parseFloat elem.val()
    if selected_lights.length == all_lights.length
      doAjaxRequest 0, {sat: value}, "group"
    else
      selected_lights.each ->
        id = $('a', this).data 'id'
        doAjaxRequest id, {sat: value}, "light"
  , 300

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
  .on 'change', '.brightness-range', ->
    adjustBrightness()
  .on 'change', '.hue-range', ->
    adjustHue()
  .on 'change', '.saturation-range', ->
    adjustSaturation()

  # Alons-y!
  init()
