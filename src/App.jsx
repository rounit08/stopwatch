import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Timer from "./Timer";
function App() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const [lapIndices, setLapIndices] = useState([]);
  const lapRefs = useRef([]);

  useEffect(() => {
    setLapIndices(Array.from({ length: laps.length }, (_, index) => index + 1));
  }, [laps]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartTimer = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleStopTimer = () => {
    setIsActive(false);
  };
  const handleReset = () => {
    setTimer(0);
    setIsActive(false);

    setLaps([]);
  };

  const handleLap = () => {
    const formattedTime = formatTime(timer);
    setLaps([...laps, { time: formattedTime, index: laps.length + 1 }]);
    lapRefs.current.push(React.createRef());
  };

  const formatTime = (time) => {
    const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
    const milliseconds = ("0" + ((time / 10) % 100)).slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("index");
    const updatedLaps = [...laps];

    // Swap lap timer
    const draggedItem = updatedLaps[draggedIndex];
    updatedLaps[draggedIndex] = updatedLaps[dropIndex];
    updatedLaps[dropIndex] = draggedItem;

    // Swap lap index
    const updatedLapIndices = [...lapIndices];
    const draggedLapIndex = updatedLapIndices[draggedIndex];
    updatedLapIndices[draggedIndex] = updatedLapIndices[dropIndex];
    updatedLapIndices[dropIndex] = draggedLapIndex;

    setLaps(updatedLaps);
    setLapIndices(updatedLapIndices); // Update lap indices state
  };

  const handleDrag = (e) => {
    laps.map((lap, index) => {
      console.log(e.clientY);
      console.log(lap);
      console.lo;
    });
  };

  return (
    <>
      <div className="timer">
        <Timer time={timer} />
      </div>
      <div className="buttons">
        <button onClick={handleLap}>Lap</button>
        {isActive ? (
          <button onClick={handleStopTimer}>Stop</button>
        ) : (
          <button onClick={handleStartTimer}>Start</button>
        )}

        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="laps">
        {laps.map((each, index) => (
          <li
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, index)}
            onDrag={(e) => handleDrag(e)}
            key={index}
            ref={lapRefs.current[index]}
            style={{
              margin: 20,
              border: "2px solid white",
              padding: 20,
              cursor: "pointer",
            }}
          >
            Lap {each.index} = {each.time}
          </li>
        ))}
      </div>
    </>
  );
}

export default App;
