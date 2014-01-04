hueIP         = "192.168.2.35"
hueUser       = "kellishaver"

body          = $ 'body'
screen        = $ '#screen'

dashboardTpl  = $('#dashboard-tpl').html()

defaultState = {
  "alert" : "none",
  "hue" : 14922,
  "effect" : "none",
  "sat" : 144,
  "bri" : 254,
  "on" : true
}

doAjaxRequest = (id, object) ->
  $.ajax "http://" + hueIP + '/api' + hueUser + '/lights/' + id + '/state',
    type: 'GET'
    dataType: 'JSON'
    type: 'PUT'
    data: JSON.stringify object
    queue: true

renderDashboard = () ->
  document.getElementById('screen').innerHTML = '';
  data = { "lights" : [] }
  $.getJSON "http://" + hueIP + '/api' + hueUser + '/lights', (res) ->
    for k,v of res
      data.lights.push({ "id" : k, "name" : v.name })
    screen.html(Mark.up(dashboardTpl, data))

turnDefault = (id) ->
  doAjaxRequest(id, defaultState)

turnDefaultAll = () ->
  $.getJSON "http://" + hueIP + '/api' + hueUser + '/lights', (res) ->
    for k,v of res
      doAjaxRequest(k, defaultState)

turnOff = (id) ->
  doAjaxRequest(id, {"on" : false})

turnOffAll = () ->
  $.getJSON "http://" + hueIP + '/api' + hueUser + '/lights', (res) ->
    for k,v of res
      doAjaxRequest(k, {"on" : false})

turnOn = (id) ->
  doAjaxRequest(id, {"on" : true})

turnOnAll = () ->
  $.getJSON "http://" + hueIP + '/api' + hueUser + '/lights', (res) ->
    for k,v of res
      doAjaxRequest(k, defaultState)

jQuery ->

  body.on 'click', 'a', (e) ->
    e.preventDefault();
  .on 'mousedown', 'a, button', ->
    $(this).addClass 'touched'
  .on 'mouseup', 'a, button', ->
    $(this).removeClass 'touched'

  .on 'click', '.dashboard', ->
    renderDashboard()

  .on 'click', '.turn-default', ->
    turnDefault($(this).data('id'))
  .on 'click', '.turn-off', ->
    turnOff($(this).data('id'))
  .on 'click', '.turn-on', ->
    turnOn($(this).data('id'))

  .on 'click', ".all-default", ->
    turnDefaultAll()
  .on 'click', ".all-off", ->
    turnOffAll()
  .on 'click', ".all-on", ->
    turnOnAll()

  renderDashboard()
