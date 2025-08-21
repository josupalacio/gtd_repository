import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ThemeContext } from "../../App";
import 'react-circular-progressbar/dist/styles.css';
import ReactSlider from "react-slider";
import "./Pomodoro.css";

{/* PlayButton & PauseButton*/ }
import { IoIosPlay } from "react-icons/io";
import { IoPauseOutline } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { TfiBackRight } from "react-icons/tfi";
const SettingsContext = createContext();

const Pomodoro = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);

  const PlayButton = (props) => (
    <button className="circle-button" {...props}>
      <span role="img" aria-label="play">
        <IoIosPlay size={32} color="black" />
      </span>
    </button>
  );
  const PauseButton = (props) => (
    <button className="circle-button" {...props}>
      <span role="img" aria-label="pause">
        <IoPauseOutline size={32} color="black" />
      </span>
    </button>
  );
  const BackButton = (props) => (
    <button className="back-button" {...props}>
      <span role="img" aria-label="back">
        <TfiBackRight />
      </span>
    </button>
  );

  const Timer = () => {
    const settingsInfo = useContext(SettingsContext);
    const { theme } = useContext(ThemeContext);
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState("work");
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    }

    useEffect(() => {
      function switchMode() {
        const nextMode = modeRef.current === "work" ? "break" : "work";
        const nextSeconds = (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;
        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
      }
      secondsLeftRef.current = settingsInfo.workMinutes * 60;
      setSecondsLeft(secondsLeftRef.current);
      const interval = setInterval(() => {
        if (isPausedRef.current) return;
        if (secondsLeftRef.current === 0) return switchMode();
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }, [settingsInfo]);

    const totalSeconds = mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return (
      <div className="container-pomodoro">
      <div className="wrapper">
        <div className="pomodoro-header">
          <div className="title">
            <p>Pomodoro Timer</p>
          </div>
        </div>
        <div className="pomodoro-body">
          <div className="pomodoro-container">
            <div className="progress">
              <div
                onClick={() => {
                  if (isPaused) settingsInfo.setShowSettings(true);
                }}
                style={{
                  cursor: isPaused ? "pointer" : "default",
                  userSelect: "none"
                }}>
                <CircularProgressbar
                  value={percentage}
                  text={minutes + ":" + seconds}
                  styles={buildStyles({
                    textColor: theme === "light" ? "#000000" : "#fff",
                    pathColor: mode === "work" ? "#A2D2FF" : "#4aec8c",
                    trailColor: "rgba(255,255,255,.2)"
                  })}
                />
              </div>

            </div>
            <div className="controls">
              {isPaused
                ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
              <BackButton
                onClick={() => {
                  // reinicia el timer según el modo actual
                  const resetSeconds = mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
                  setSecondsLeft(resetSeconds);
                  secondsLeftRef.current = resetSeconds;
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };

  const Settings = () => {
    const settingsInfo = useContext(SettingsContext);
    return (
      <div className="wrapper">
        <h2>Ajustes</h2>
        <div className="settings-content">
          <label>work: {settingsInfo.workMinutes}:00</label>
          <ReactSlider className="slider" value={settingsInfo.workMinutes} onChange={newValue => settingsInfo.setWorkMinutes(newValue)} min={1} max={120} thumbClassName="thumb" trackClassName="track" />
          <label>break: {settingsInfo.breakMinutes}:00</label>
          <ReactSlider className="slider green" value={settingsInfo.breakMinutes} onChange={newValue => settingsInfo.setBreakMinutes(newValue)} min={1} max={120} thumbClassName="thumb" trackClassName="track" />
          <div className="back-div"><BackButton onClick={() => settingsInfo.setShowSettings(false)} /></div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="pomodoro">
        <SettingsContext.Provider value={{ showSettings, setShowSettings, workMinutes, breakMinutes, setWorkMinutes, setBreakMinutes }}>
          {showSettings ? <Settings /> : <Timer />}
        </SettingsContext.Provider>
      </div>
    </div>
  );
};

export default Pomodoro;