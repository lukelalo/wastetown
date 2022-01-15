export const TRAP = "ITS A TRAP";
export const trap = () => ({ type: TRAP });

// Player actions
export const PLAYER_ACTION = "PLAYER ACTION";
export const playerAction = (payload) => ({ type: PLAYER_ACTION, payload });

export const PLAYER_IDLE = "PLAYER IDLE";
export const playerIdle = () => ({ type: PLAYER_IDLE });

export const PLAYER_INIT = "PLAYER INIT";
export const playerInit = (payload) => ({ type: PLAYER_INIT, payload });

export const PLAYER_INTERACT = "PLAYER INTERACT";
export const playerInteract = (payload) => ({ type: PLAYER_INTERACT, payload });

export const PLAYER_PATH = "PLAYER PATH";
export const playerPath = (payload) => ({ type: PLAYER_PATH, payload });

export const PLAYER_POSITION = "PLAYER POSITION";
export const playerPosition = (payload) => ({ type: PLAYER_POSITION, payload });

// Town actions

// Videogame actions
export const VIDEOGAME_ENABLE_CLICK = "VIDEOGAME ENABLE CLICK";
export const videogameEnableClick = (payload) => ({
  type: VIDEOGAME_ENABLE_CLICK,
  payload: { instant: true, ...payload },
});

export const VIDEOGAME_DISABLE_CLICK = "VIDEOGAME DISABLE CLICK";
export const videogameDisableClick = (payload) => ({
  type: VIDEOGAME_DISABLE_CLICK,
  payload: { instant: true, ...payload },
});

export const VIDEOGAME_NEXT_ACTION = "VIDEOGAME NEXT ACTION";
export const videogameNextAction = (payload) => ({
  type: VIDEOGAME_NEXT_ACTION,
  payload,
});

export const VIDEOGAME_NEXT_DIALOG = "VIDEOGAME NEXT DIALOG";
export const videogameNextDialog = (payload) => ({
  type: VIDEOGAME_NEXT_DIALOG,
  payload,
});

export const VIDEOGAME_CLICK_CHOICE = "VIDEOGAME CLICK CHOICE";
export const videogameClickChoice = (payload) => ({
  type: VIDEOGAME_CLICK_CHOICE,
  payload,
});

export const VIDEOGAME_SET_ACTIONS = "VIDEOGAME SET ACTIONS";
export const videogameSetActions = (payload) => ({
  type: VIDEOGAME_SET_ACTIONS,
  payload,
});

// Event actions
export const EVENTS_INIT = "EVENTS INIT";
export const eventsInit = (payload) => ({ type: EVENTS_INIT, payload });

export const EVENTS_DONE = "EVENTS DONE";
export const eventsDone = (payload) => ({
  type: EVENTS_DONE,
  payload: { instant: true, ...payload },
});

// GAME ACTIONS
export const MOVE_PLAYER = "MOVE PLAYER";
export const movePlayer = (payload) => ({ type: MOVE_PLAYER, payload });

export const SHOW_TEXT = "SHOW TEXT";
export const showText = (payload) => ({ type: SHOW_TEXT, payload });

export const SHOW_CHOICES = "SHOW CHOICES";
export const showChoices = (payload) => ({ type: SHOW_CHOICES, payload });

export const CHANGE_SCENE = "CHANGE SCENE";
export const changeScene = (payload) => ({
  type: CHANGE_SCENE,
  payload: { instant: true, ...payload },
});
