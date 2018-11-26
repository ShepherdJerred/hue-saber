# huesaber
Set Philips Hue lights based on Beat Saber events

# Requirements
* Node.js (developed with version 9.3.0)
* Beat Saber with the HTTP status plugin (Use the [plugin installer](https://www.modsaber.org/))
* A Philips Hue bridge on the same network as the computer running Beat Saber with a color bulb

# Caveats
This application was developed on a network with one Hue bridge and one color bulb. Due to this, there are a few limitations.

* If you have more than one Hue bridge, this will use the first one it finds
* If your bridge has more than one bulb, this will use the first one based on its ID in the bridge
* I'm not sure what will happen if the bulb that is selected is not a color bulb

# How to use huesaber
1. Install dependencies with npm i
2. Build the project with npm run build
3. Copy .env.sample to .env
4. Edit the SOCKET_URL value in the .env file if needed
5. Press the button on your Hue bridge
6. Run the program with npm run start
7. Play!
