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

export const VIDEOGAME_SET_ACTIONS = "VIDEOGAME SET ACTIONS";
export const videogameSetActions = (payload) => ({
  type: VIDEOGAME_SET_ACTIONS,
  payload,
});

// Quest actions
export const QUEST_DONE = "QUEST DONE";
export const questDone = (payload) => ({ type: QUEST_DONE, payload });

// GAME ACTIONS
export const MOVE_PLAYER = "MOVE_PLAYER";
export const movePlayer = (payload) => ({ type: MOVE_PLAYER, payload });
