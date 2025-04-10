import {useState} from 'react';
import { clsx } from 'clsx';
import {languages} from './languages';
import { getFarewellText } from './utils';
import {getRandomWord} from './utils';
import Confetti from "react-confetti"
/**
 * The main React component for the game.
 * This component renders the entire game UI, including the
 * languages, the current word, the alphabet, and the game status.
 * It also handles all the game logic, including
 * - tracking the current word and the guessed letters
 * - determining when the game is won or lost
 * - rendering the correct or incorrect letter buttons
 * - rendering the game status messages
 * - handling the new game button
 */
export default function App() {

    // state value for current word
    const [currentword, setcurrentword] = useState(() => getRandomWord());
    const[guessedword, setguessedword] = useState([]);
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    // number of guesses left
    const numGuessesLeft = languages.length - 1
    // number of incorrect guesses so far
    const wordGuessCount = guessedword.filter(letter => !currentword.includes(letter)).length;
    // is the game won?
    const isGameWon = currentword.split("").every(letter => guessedword.includes(letter));
    // is the game lost?
    const isGameLost = wordGuessCount >= numGuessesLeft;
    // is the game over (either won or lost)
    const isGameOver = isGameWon || isGameLost;
    // last guessed letter
    const lastGuessedLetter = guessedword[guessedword.length - 1]
    // is the last guess incorrect?
    const isLastGuessIncorrect = lastGuessedLetter && !currentword.includes(lastGuessedLetter)



    /**
     * Adds a guessed letter to the state.
     * If the letter has already been guessed, do nothing.
     * @param {string} letter the letter to add
     */
    function addGuessedLetter(letter) {
        setguessedword(prev => 
            prev.includes(letter) ? prev : [...prev, letter]);
        
    
    }

    /**
     * Resets the game state to a new word and empty guessed letters.
     */
    function resetGame() {
        setcurrentword(getRandomWord());
        setguessedword([]);
    }




    // another way using set function
    // function addGuessedLetter(letter) {
    //     setguessedword(prev => {
    //         const letterset=new Set(prev);
    //         letterset.add(letter);
    //         return Array.from(letterset);
    //     });
    // }




    // render the language chips
    const languageElements = languages.map((language, index) => {
        const isLanguageLost=index<wordGuessCount;
        const styles = {
            backgroundColor: language.backgroundColor,
            color: language.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span className={className}
            key={index}
            style={styles}>{language.name}  </span>
        )
    });

    // render the current word with guessed letters
    const letterElements = currentword.split("").map((letter, index) =>
        {
            const shouldReavealLetter = isGameLost || guessedword.includes(letter);
            const letterClassName = clsx( isGameLost && !guessedword.includes(letter) && "missed-letter");
       return (

        shouldReavealLetter ? <span key={index}
        className={letterClassName}>{letter.toUpperCase()}</span> : <span key={index} ></span>
    )})
    // render the alphabet buttons
    const alphabetElements = alphabet.split("").map((letter, index) =>
        {
            const isGuessed = guessedword.includes(letter);
            const isCorrect = isGuessed && currentword.includes(letter);
            const isWrong = isGuessed && !currentword.includes(letter);
            const className = clsx({
                correct: isCorrect,
                wrong: isWrong,
            });
            
            return(
                <button 
                className={className}
                onClick={() => addGuessedLetter(letter)} 
                disabled={isGameOver}
                aria-disabled={guessedword.includes(letter)}
                aria-label={`Letter ${letter}`}
                key={index}>
                    {letter.toUpperCase()}</button>
    )})

    // render the game status messages
    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

/*************  ✨ Windsurf Command 🌟  *************/
    /**
     * Renders the game status message.
     * This function renders a message depending on the
     * state of the game.
     * If the game is won, render a victory message.
     * If the game is lost, render a defeat message.
     * If the game is not over, render a farewell message
     * if the last guess was incorrect.
     * @returns {JSX.Element} the game status message element
     */
    function renderGameStatus() {
        // if the game is not over and the last guess was incorrect
        // render a farewell message with the name of the language
        // that the player is about to lose
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                // render a p element with the farewell message
                // get the farewell message using the getFarewellText function
                // pass the name of the language that the player is about to lose
                // as the argument to the function
                <p className="farewell-message">{getFarewellText(languages[wordGuessCount-1].name)}</p>
            )
           
        }

        // if the game is won, render a victory message
        if (isGameWon) {
            return (
                // render a fragment element
                // inside the fragment, render an h2 element with the text "You win!"
                // and a p element with the text "Well done! "
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 

        // if the game is lost, render a defeat message
        if (isGameLost) {
            return (
                // render a fragment element
                // inside the fragment, render an h2 element with the text "Game over!"
                // and a p element with the text "You lose! Better start learning Assembly "
                // and another p element with the text "The word was "
                // followed by a strong element with the text of the word
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                    <p>The word was <strong>{currentword}</strong></p>
                </>
            )
        }
    }

    return (
        <main>
            {isGameWon && <Confetti
            numberOfPieces={2000}
            recycle={false}
             />}
            <header>
              <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>
            <section aria-live="polite"
            role="status"
            className={gameStatusClass}>
               { renderGameStatus()}   
            </section>
            <section className='languages-chips'>
                {languageElements}
            </section>
            <section className='word'> 
                {letterElements}
            </section>
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                  <p>
                    {currentword.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentword.split("").map(letter => 
                guessedword.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>
            <section className='alphabet'>
                {alphabetElements}
            </section>
            {isGameOver && <button onClick={resetGame} className="new-game">New Game</button>}

        </main>
    )
}
