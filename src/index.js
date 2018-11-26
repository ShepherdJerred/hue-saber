import WebSocket from 'ws';
import * as hue from 'node-hue-api';
import * as dotenv from 'dotenv';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

dotenv.config();
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  hue: {
    username: null
  }
});

(async function main () {
  let hueApi;
  try {
    hueApi = await connectToHue();
  } catch (err) {
    console.error('Error connecting to Hue bridge');
    console.error(err);
    return;
  }
  if (hueApi) {
    const light = await getLight(hueApi);
    listenForEvents(hueApi, light);
  } else {
    console.error('Hue API not created');
    process.exit(1);
  }
})();

function saveUsername (username) {
  return db.set('hue.username', username).write();
}

function loadUsername () {
  return db.get('hue.username').value();
}

async function getUsername (host) {
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

async function getBridge () {
  try {
    const bridges = await hue.nupnpSearch();
    console.log('Bridges found');
    console.log(bridges);
    return bridges[0];
  } catch (err) {
    console.error(err);
  }
}

async function testBridgeConnection (hueApi) {
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

async function connectToHue () {
  const bridge = await getBridge();
  const { ipaddress } = bridge;
  const username = await getUsername(ipaddress);

  const hueApi = new hue.HueApi(ipaddress, username);
  // await testBridgeConnection(hueApi);
  return hueApi;
}

async function getLight (hueApi) {
  try {
    const lights = await hueApi.lights();
    // console.log(lights);
    // await setRed(hueApi, lights.lights[0].id, false);
    // await setBlue(hueApi, lights.lights[0].id, false);
    return lights.lights[0];
  } catch (err) {
    console.error(err);
  }
}

async function setColor (hueApi, light, fade, color) {
  const state = hue.lightState.create().on().rgb(color.r, color.g, color.b).transitionInstant();
  const result = await hueApi.setLightState(light, state);
  // console.log(result);
  return result;
}

async function setRed (hueApi, light, fade) {
  await setColor(hueApi, light, fade, { r: 255, g: 0, b: 0 });
}

async function setBlue (hueApi, light, fade) {
  await setColor(hueApi, light, fade, { r: 0, g: 0, b: 255 });
}

async function setBlank (hueApi, light) {
  const state = hue.lightState.create().off();
  await hueApi.setLightState(light, state);
}

async function setBright (hueApi, light) {

}

function processHello (data) {
  // console.log(data);
  console.log('Connected to beatsaver-http-status');
}

function processBeatmapEvent (hueApi, light, data) {
  console.log('Beatmap event received');
  console.log(data);
  const { type, value } = data.beatmapEvent;
  console.log(type);
  console.log(value);
  if (type < 5) {
    console.log('Lighting event received');
    switch (value) {
      case 0:
        setBlank(hueApi, light.id);
        break;
      case 1:
      case 2:
        setBlue(hueApi, light.id, false);
        break;
      case 3:
        setBlue(hueApi, light.id, true);
        break;
      case 4:
        // Unused?
        break;
      case 5:
      case 6:
        setRed(hueApi, light.id, false);
        break;
      case 7:
        setRed(hueApi, light.id, false);
        break;
      default:
    }
  }
}

function listenForEvents (hueApi, light) {
  const { SOCKET_URL } = process.env;

  console.log('Connecting to beatsaver-http-status');

  const ws = new WebSocket(SOCKET_URL);

  ws.onmessage = data => {
    // console.log(data);
    data = JSON.parse(data.data);
    if (data.event === 'hello') {
      processHello(data);
    } else if (data.event === 'beatmapEvent') {
      processBeatmapEvent(hueApi, light, data);
    }
  };

  ws.on('hello', (data) => {
    console.log('FROM ON?');
  });

  ws.on('beatmapEvent', (data) => {
    console.log('FROM ON?');
  });
}
