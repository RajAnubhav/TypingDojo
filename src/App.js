import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";

const getCloud = () =>
  `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`.split(
    " "
  ).sort(()=>Math.random() > 0.5 ? 1:-1);

function Word(props) {
  const { text, active, correct } = props;
  if (correct === true) {
    return <span className="correct">{text} </span>;
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }

  if (active) {
    return <span className="active">{text} </span>;
  }
  return <span>{text} </span>;
}

Word = React.memo(Word); // this reduces the re-rendering

function Timer(props) {
  const { correctWords, startCounting } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        // do something
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div>
      <p><b>Time: </b> {timeElapsed}</p>
      <p><b>Speed: </b> {(correctWords / minutes || 0).toFixed(2)} WPM </p>
    </div>
  );
}

function App() {
  const [userInput, setUserInput] = useState("");

  const cloud = useRef(getCloud());
  const [startCounting, setStartCounting] = useState(false);

  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // maintaing the array for correct word
  const [correctwordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    // TODO: Add validation for the quiz end
    // Word count and the timer
    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(" ")) {
      // the user has finished this word
      if (activeWordIndex === cloud.current.length - 1) {
        // we are at the last word
        // overflow
        setStartCounting(false);
        setUserInput("Completed");
        return;
      }
      setActiveWordIndex((index) => index + 1);
      setUserInput("");

      // correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="heading">Typing Dojo</h1>
        <Timer
          startCounting={startCounting}
          correctWords={correctwordArray.filter(Boolean).length}
        />
        <p className="word">
          {cloud.current.map((word, index) => {
            return (
              <Word
                text={word}
                active={index === activeWordIndex}
                correct={correctwordArray[index]}
              />
            );
          })}
        </p>

		  <div className="inputsize">
			<input
			type="text"
			value={userInput}
			placeholder="Start Typing..."
			onChange={(e) => processInput(e.target.value)}
			/>
		  </div>
      </div>
    </div>
  );
}

export default App;
