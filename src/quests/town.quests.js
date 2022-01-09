import { Directions } from "../constants/game.constants";

export default [
  {
    id: 1,
    // Textos que apareceran como dialogo
    script: [
      { text: "Hola, soy una papelera" },
      { text: "Estoy llena de basura" },
    ],
    // Comprobacion de que el quest se debe poner en marcha
    at: { x: 12, y: 18 },
    // Destino hacia el que ira el personaje al iniciar el quest
    from: { x: 12, y: 19 },
    // Direccion en la que se quedara mirando
    direction: Directions.UP,
    done: false,
  },
  {
    id: 2,
    script: [
      { text: "Ves un coche viejo y destartalado aparcado" },
      {
        text: "No sabes cómo, pero continúa echando humo por el tubo de escape",
      },
    ],
    at: { x: 7, y: 16 },
    from: { x: 6, y: 16 },
    direction: Directions.RIGHT,
    done: false,
  },
];
