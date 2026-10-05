import React, {type RefObject, useState} from "react";
import './slots.css';

const WIN_TEXT = "You Win!"
const LOSE_TEXT = "You Lose!"

function randomInt(min = 0, max = 9) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

type RollerProps = {
    onStop: (value: number, index: number) => void;
    index: number
    isSpinning: boolean
};

type RerollButtonProps = {
    onClick: () => void
}


/**
 Функция имитирует вращение барабана с постепенной остановкой
 - используй onRoll для анимации вращения (смена текущего значения на барабане)
 - и onStop для оповещения, когда барабан закончил крутиться
 пример
 runSpinner (
 () => setValue(v => ++v % 10),
 () => console.log('finished')
 )
 ..
 */
function runSpinner(onRoll: () => void, onStop: () => void) {
    const velocityPerRound = 200;
    const initialSpinTime = 50;

    const initialVelocity = randomInt(3000, 5000);
    let remainVelocity = initialVelocity;

    const round = () => {
        const nextRoundSpinTime = (initialVelocity - remainVelocity) / 10;
        remainVelocity -= velocityPerRound;
        if (remainVelocity < 0) {
            onStop();
            return;
        }
        onRoll();
        setTimeout(round, nextRoundSpinTime);
    };

    setTimeout(round, initialSpinTime);
}

function Roller({onStop, index, isSpinning}: RollerProps) {
    const [value, setValue] = React.useState(0);
    const valueRef: RefObject<number> = React.useRef(randomInt(0, 9))

    React.useEffect(() => {
        if (isSpinning) {
            runSpinner(
                () => {
                    let newValue: number = ++valueRef.current % 10
                    setValue(newValue)
                    valueRef.current = newValue
                },
                () => {
                    onStop(valueRef.current, index)
                }
            );
        }
    }, [isSpinning])

    return <span>{value}</span>;
}

function RerollButton({onClick}: RerollButtonProps) {
    return ( <button className="spin-button" onClick={onClick}> SPIN! </button> )
}


function App() {
    const valueRefs: RefObject<number[]> = React.useRef([0, 0, 0])
    let [runningRollingCount, setRunningRollingCount] = useState(3);

    const [resultText, setResultText] = React.useState("")
    const [isSpinning, setIsSpinning] = React.useState(false)

    function handleRollerStop(value: number, index: number) {
        setRunningRollingCount(current => current - 1)
        valueRefs.current[index] = value
    }

    React.useEffect(
        () => {
            if (runningRollingCount === 0) {
                if (valueRefs.current[0] === valueRefs.current[1] && valueRefs.current[1] === valueRefs.current[2]) {
                    setResultText(WIN_TEXT)
                } else {
                    setResultText(LOSE_TEXT)
                }
                setIsSpinning(false)
            } else {
                setResultText("")
            }
        }, [runningRollingCount]
    )


    return (<div className="slot-page">
        <div className="slot-machine"><h1>🎰 Slot Machine</h1>
            <div className="rollers">
                <div className="roller"><Roller onStop={handleRollerStop} index={0} isSpinning={isSpinning}/></div>
                <div className="roller"><Roller onStop={handleRollerStop} index={1} isSpinning={isSpinning}/></div>
                <div className="roller"><Roller onStop={handleRollerStop} index={2} isSpinning={isSpinning}/></div>
            </div>
            <RerollButton onClick={() => {
                setRunningRollingCount(3)
                setIsSpinning(true)
            }}/>
            <div className="result"> {resultText} </div>
        </div>
    </div>)
}

export default App;