export const TRAP = "ITS A TRAP";
export const trap = () => ({ type: TRAP });

export const PLAYER_INIT = "PLAYER INIT";
export const playerInit = (payload) => ({ type: PLAYER_INIT, payload });

export const PLAYER_MOVE = "PLAYER MOVE";
export const playerMove = (payload) => ({ type: PLAYER_MOVE, payload });

export const PLAYER_POSITION = "PLAYER POSITION";
export const playerPosition = (payload) => ({ type: PLAYER_POSITION, payload });

export const PLAYER_STEP = "PLAYER STEP";
export const playerStep = (payload) => ({ type: PLAYER_STEP, payload });

export const PLAYER_STOP = "PLAYER STOP";
export const playerStop = (payload) => ({ type: PLAYER_STOP, payload });
