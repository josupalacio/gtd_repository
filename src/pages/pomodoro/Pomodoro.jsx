import { createContext, useState, useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ThemeContext } from "../../App";
import 'react-circular-progressbar/dist/styles.css';
import ReactSlider from "react-slider";

// CONTEXTO
const SettingsContext = createContext();

// BOTONES
function PlayButton(props) {
  return (
    <CircleButton {...props}>
      <span role="img" aria-label="play">▶️</span>
    </CircleButton>
  );
}
function PauseButton(props) {
  return (
    <CircleButton {...props}>
      <span role="img" aria-label="pause">⏸️</span>
    </CircleButton>
  );
}
function SettingsButton(props) {
  return (
    <CircleButton {...props}>
      <span role="img" aria-label="settings">⚙️</span>
    </CircleButton>
  );
}
function BackButton(props) {
  return (
    <StyledBackButton {...props}>
      <span role="img" aria-label="back">🔙</span> Volver
    </StyledBackButton>
  );
}

// TIMER
const red = '#f54e4e';
const green = '#4aec8c';

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  //Tema
  const { theme } = useContext(ThemeContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work'); // work/break/null
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
      const nextMode = modeRef.current === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds = mode === 'work'
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = '0' + seconds;

  return (
    <Wrapper>
      <h2>Pomodoro Timer</h2>
      <Progress>
        <CircularProgressbar
          value={percentage}
          text={minutes + ':' + seconds}
          styles={buildStyles({
            textColor: theme === "light" ? "#000000" : "#fff",
            pathColor: mode === 'work' ? red : green,
            trailColor: 'rgba(255,255,255,.2)',
          })}
        />
      </Progress>
      <Controls>
        {isPaused
          ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
          : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </Controls>
    </Wrapper>
  );
}

// SETTINGS
function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return (
    <Wrapper>
      <h2>Ajustes</h2>
      <SettingsContent>
        <label >work: {settingsInfo.workMinutes}:00</label>
        <StyledSlider
          value={settingsInfo.workMinutes}
          onChange={newValue => settingsInfo.setWorkMinutes(newValue)}
          min={1}
          max={120}
          thumbClassName="thumb"
          trackClassName="track"
        />
        <label>break: {settingsInfo.breakMinutes}:00</label>
        <StyledSlider
          className="green"
          value={settingsInfo.breakMinutes}
          onChange={newValue => settingsInfo.setBreakMinutes(newValue)}
          min={1}
          max={120}
          thumbClassName="thumb"
          trackClassName="track"
        />
        <BackDiv>
          <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
        </BackDiv>
      </SettingsContent>
    </Wrapper>
  );
}

function Pomodoro() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);

  return (
    <div>
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </div>
  );
}

export default Pomodoro;

// ------------------- STYLED COMPONENTS -------------------

const Wrapper = styled.div`
  max-width: 340px;
  margin: 40px auto;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border-radius: 16px;
  box-shadow: 0 4px 24px ${({ theme }) => theme.bg3}44;
  padding: 32px 24px;
  text-align: center;
`;

const Progress = styled.div`
  margin: 0 auto 24px auto;
  width: 200px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const CircleButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 0;
  display: inline-block;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
`;

const StyledBackButton = styled.button`
  width: auto;
  background-color: ${({ theme }) => theme.bg3};
  border-radius:10px;
  padding: 10px 20px;
  font-size: 1.1rem;
  line-height: 36px;
  margin-top: 10px;
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const SettingsContent = styled.div`
  text-align: left;
  label {
    display: block;
    margin-bottom: 10px;
    margin-top: 20px;
    text-transform: capitalize;
  }
`;

const BackDiv = styled.div`
  text-align: center;
  margin-top: 20px;
`;

// SLIDER STYLES
const StyledSlider = styled(ReactSlider).attrs(props => ({
  className: props.className,
  thumbClassName: "thumb",
  trackClassName: "track"
}))`
  width: 100%;
  height: 40px;
  margin: 10px 0 20px 0;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 20px;

  &.green {
    border: 2px solid ${({ theme }) => theme.bg4};
  }

  .thumb {
    background-color: ${({ theme }) => theme.primary};
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
  &.green .thumb {
    background-color: ${({ theme }) => theme.bg4};
  }
  .track {
    top: 50%;
    transform: translateY(-50%);
    height: 8px;
    border-radius: 4px;
    background: ${({ theme }) => theme.bg4};
  }
  &.green .track {
    background: ${({ theme }) => theme.bg4};
  }
`;