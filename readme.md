Hue CP
====

This is a simple HTML/CSS/JavaScript control panel for my Phillip's Hue lights. It's intended to be accessed over a local network (or eventually saved to the home screen of your mobile device).

At the moment, it's pretty basic, but I'll add to it as I have time.

For now, the app assumes you've already done the whole handshake with the base. Once you've done that, edit the `hueIP` and `hueUser` variables at the top of the `panel.coffee` file and re-compile the JavaScript.

In the future, I'll automate this process, or I won't, since it's easy and I've already done it.

###Find your Hue Base STation

First off, you'll need to find the internal network IP for your Hue base station. The easiest way to do this is to navigate to https://www.meethue.com/api/nupnp and grab it.

Alternately, you can pull up your router's DCHP client list, where you should see it listed as "Philips-hue"

You'll plug this IP address into the CoffeeScript file for the `hueIP` variable, and you'll also use it to talk to the base station as outlined below.

###Say "Hello" to the Base Station

Press the button on the Hue base station and then make an HTTP POST request to http://YourHueIP/api like so:

    {"username":"YourUsername", "devicetype":"YourAppName"}

You should get the following response:

    {"success":{"username":"YourUsername"}}

Now that username should be plopped into the CoffeeScript file as the value for `hueUser`

###We Need to Go Deeper

Since this is still very much a work in progress, if you want to do some hacking of your own, you can check out the API docs here: http://developers.meethue.com/index.html

