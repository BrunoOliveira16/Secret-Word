import "./Game.css";

const Game = ({verifyletter}) => {
  return (
    <div>
        <h1>Game</h1>
        <button onClick={verifyletter}>Finalizar o jogo</button>
    </div>
  );
};

export default Game;