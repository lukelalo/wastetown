export const TRAP = "ITS A TRAP";
export const trap = () => ({ type: TRAP });


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



export const CHANGE_SCENE = "CHANGE SCENE";
export const changeScene = (payload) => ({
  type: CHANGE_SCENE,
  payload: { instant: true, ...payload },
});


