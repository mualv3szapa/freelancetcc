import { useState } from "react";
import { TimerRacaoObj, TimerRacaoView } from "./Style";

export const TimerRacao = ({ handleFinish, reset }) => {
  const [isTimerStart, setIsTimerStart] = useState(true);
  const [timerDuration, setTimerDuration] = useState(8000);
  

  return (
    <TimerRacaoView>
      <TimerRacaoObj
        totalDuration={timerDuration}
        msecs
        start={isTimerStart}
        reset={reset}
        // options={timer}
        // onFinish={onFinish}
        handleFinish={handleFinish}
        getTime={(time) => {
          console.log(time);
        }}
      />
    </TimerRacaoView>
  );
};
