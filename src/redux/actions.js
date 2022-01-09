export const TRAP = "ITS A TRAP";
export const trap = () => ({ type: TRAP });

// Player actions
export const PLAYER_ACTION = "PLAYER ACTION";
export const playerAction = (payload) => ({ type: PLAYER_ACTION, payload });

export const PLAYER_IDLE = "PLAYER IDLE";
export const playerIdle = (payload) => ({ type: PLAYER_IDLE, payload });

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

// Quest actions
export const QUEST_DONE = "QUEST DONE";
export const questDone = (payload) => ({ type: QUEST_DONE, payload });
