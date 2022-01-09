import { Directions } from "../constants/game.constants";

export default [
  {
    id: 1,
    script: [
      { text: "Hola, soy una papelera" },
      { text: "Estoy llena de basura" },
    ],
    at: { x: 12, y: 18 },
    from: { x: 12, y: 19 },
    direction: Directions.UP,
    done: false,
  },
];
