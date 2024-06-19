import { useState } from "react";
import { TimerRacaoObj, TimerRacaoView } from "./Style";

export const TimerRacao = ({ onFinish }) => {
  const [isTimerStart, setIsTimerStart] = useState(true);
  const [timerDuration, setTimerDuration] = useState(5000);
  const [resetTimer, setResetTimer] = useState(false);

  return (
    <TimerRacaoView>
      <TimerRacaoObj
        totalDuration={timerDuration}
        msecs
        start={isTimerStart}
        reset={resetTimer}
        // options={timer}
        onFinish={onFinish}
        handleFinish={() => {
          alert("Timer Concluído!");
        }}
        getTime={(time) => {
          console.log(time);
        }}
      />
    </TimerRacaoView>
  );
};
