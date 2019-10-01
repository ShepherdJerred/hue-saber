import WebSocket from "ws";

async function listenForEvents(hueApi, lights) {
  const {SOCKET_URL} = process.env;

  console.log('Connecting to beatsaver-http-status');

  const ws = new WebSocket(SOCKET_URL);

  ws.onmessage = data => {
    // console.log(data);
    data = JSON.parse(data.data);
    try {
      switch (data.event) {
        case 'hello':
          processHello(data);
          break;
        case 'beatmapEvent':
          for (let light in lights) {
            processBeatmapEvent(hueApi, light, data);
          }
          break;
        case 'finished':
          console.log('Finished song');
          for (let light in lights) {
            processFinishedEvent(hueApi, light);
          }
        case 'songStart':
          console.log('Starting song');
          for (let light in lights) {
            processStartEvent(hueApi, light);
          }
          break;
        case 'pause':
          console.log('Pausing song');
          for (let light in lights) {
            processPauseEvent(hueApi, light);
          }
          break;
        case 'resume':
          console.log('Resuming song');
          for (let light in lights) {
            processResumeEvent(hueApi, light);
          }
      }
    } catch (err) {
      console.error(err);
    }
  };
