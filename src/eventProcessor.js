function handleEvent(event, handlers) {
  let handlersForEvent;

  switch (event.type) {
    case 'SONG_START':
      handlersForEvent = handlers.song.start;
      break;
    case 'SONG_END':
      handlersForEvent = handlers.song.end;
      break;
    case 'GAME_PAUSE':
      handlersForEvent = handlers.game.pause;
      break;
    case 'GAME_RESUME':
      handlersForEvent = handlers.game.resume;
      break;
    case 'BEATMAP_BACKGROUND_CHANGE':
      handlersForEvent = handlers.beatmap.background.change;
      break;
  }

  handlersForEvent.forEach(handler => {
    handler.handle(event);
  });
}
