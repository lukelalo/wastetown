export const INIT = "EVENTS INIT";
export const init = (payload) => ({ type: INIT, payload });

export const DONE = "EVENTS DONE";
export const done = (payload) => ({
  type: DONE,
  payload: { instant: true, ...payload },
});

export default (state = {}, { type, payload, map }) => {
  switch (type) {
    case INIT:
      return {
        ...payload,
        ...state
      }

    case DONE:
      return {
        ...state,
        [map]: state[map].map(e => e.id === payload.id ? {...e, done: true} : e)
      }
    default:
      return state;
  }
};
