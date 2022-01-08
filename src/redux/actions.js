export const TRAP = "ITS A TRAP";
export const trap = () => ({ type: TRAP });

export const PLAYER_INIT = "PLAYER INIT";
export const playerInit = (payload) => ({ type: PLAYER_INIT, payload });

export const PLAYER_PATH = "PLAYER PATH";
export const playerPath = (payload) => ({ type: PLAYER_PATH, payload });

export const PLAYER_POSITION = "PLAYER POSITION";
export const playerPosition = (payload) => ({ type: PLAYER_POSITION, payload });
