const LightState = require("node-hue-api/lib/model/lightstate/LightState");
const v3 = require('node-hue-api').v3, hueApi = v3.api;

async function discoverAndCreateUser() {
  const ipAddress = "192.168.1.4";
  const createdUser = {
    username: "OqghrGeoT3niFZz69cd0lIPfoIyxLPVzoUF33qgY",
    clientkey: "5A1DA52E09412376396E37D198E949F0"
  };

  // Create a new API instance that is authenticated with the new user we created
  const api = await hueApi.createLocal(ipAddress).connect(
      createdUser.username);

  // Do something with the authenticated user/api
  const bridgeConfig = await api.configuration.get();
  console.log(
      `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

  api.lights.getAll()
  .then(allLights => {
    // Display the lights from the bridge
    console.log(allLights);
    allLights.forEach(light => {
      const lightId = light.id

      const state = new LightState()
      .on()
      .ct(randomIntFromInterval(153, 500))
      .brightness(randomIntFromInterval(0, 100));


      return api.lights.setLightState(lightId, state);
    })
  });

}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Invoke the discovery and create user code
discoverAndCreateUser();
