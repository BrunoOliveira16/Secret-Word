// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react";

// Data
import {wordsList} from "./data/words";

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 2, name: "end"},
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWorld, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  const [useWords, setUsedWords] = useState([]);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick a random word
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates();

    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    if (useWords.includes(word)){
      startGame();
      return;
    };
    useWords.push(word)

    // create an array of letters
    let wordLetters = word.split("");

    // set all lowercase
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory, useWords]);

  // process the letter input
  const verifyletter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push gessed letter or remove a guess
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      // reset all stages
      clearLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  // Check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      setScore((actualScore) => (actualScore += 100));
      setGuesses(guessesQty)
      // restart game with new word
      setTimeout(function (){
        startGame();
      }, 1000);
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  // restart the game
  const retry = () => {
    setUsedWords([]);
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyletter={verifyletter} 
          pickedWorld={pickedWorld} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses} 
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
