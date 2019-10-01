import * as hue from "node-hue-api";



async function getUsername(host) {
  let username = loadUsername();
  if (!username) {
    try {
      const hueApi = new hue.HueApi();
      username = await hueApi.registerUser(host, 'huesaber');
      console.log('Registered user');
      console.log(username);
      saveUsername(username);
    } catch (err) {
      console.error(err);
    }
  }
  return username;
}

async function getBridge() {
  try {
    const bridges = await hue.nupnpSearch();
    console.log('Bridges found');
    console.log(bridges);
    return bridges[0];
  } catch (err) {
    console.error(err);
  }
}

async function testBridgeConnection(hueApi) {
  try {
    const config = await hueApi.config();
    console.log('Connected to bridge');
    console.log(config);

    const fullState = await hueApi.getFullState();
    console.log(fullState);
  } catch (err) {
    console.error(err);
  }
}

async function connectToHue() {
  const bridge = await getBridge();
  const {ipaddress} = bridge;
  const username = await getUsername(ipaddress);

  const hueApi = new hue.HueApi(ipaddress, username);
  // await testBridgeConnection(hueApi);
  return hueApi;
}

async function getLights(hueApi) {
  try {
    const lights = await hueApi.lights();
    // console.log(lights);
    // await setRed(hueApi, lights.lights[0].id, false);
    // await setBlue(hueApi, lights.lights[0].id, false);
    return lights;
  } catch (err) {
    console.error(err);
  }
}

async function setColor(hueApi, lightId, fade, color) {
  let state;
  state = hue.lightState.create().on(true).rgb(color.r, color.g,
      color.b).brightness(100).transition(100);
  let result = await hueApi.setLightState(lightId, state);
  if (fade) {
    state = hue.lightState.create().on(true).rgb(color.r, color.g,
        color.b).brightness(0).transition(1000);
    result = await hueApi.setLightState(lightId, state);
  }
  return result;
}

async function setRed(hueApi, lightId, fade) {
  lastColor = 'red';
  await setColor(hueApi, lightId, fade, {r: 255, g: 0, b: 0});
}

async function setBlue(hueApi, lightId, fade) {
  lastColor = 'blue';
  await setColor(hueApi, lightId, fade, {r: 0, g: 0, b: 255});
}

async function setBlank(hueApi, lightId) {
  lastColor = 'blank';
  let state;
  state = hue.lightState.create().brightness(0).off().transition(1000);
  await hueApi.setLightState(lightId, state);
}

async function setBright(hueApi, lightId) {
  let state = hue.lightState.create().on(true).scene('bright');
  await hueApi.setLightState(lightId, state);
}
