import { useState, useRef, useEffect } from "react"
import "./App.css"

function App() {
  const logBoxRef = useRef(null)
  const typedBoxRef = useRef(null)
  const [log, setLog] = useState([])
  const [typed, setTyped] = useState("")

  const onClick = (event) => {
    const {
      target: { name },
    } = event

    if (name === "=") {
      try {
        eval(typed)
        setLog([...log, typed, `=${eval(typed)}`])
        setTyped((prev) => eval(prev))
      } catch {
        console.log("error")
      }
    } else if (name === "clear") {
      setTyped("")
    } else if (name === "back") {
      setTyped((prev) => prev.slice(0, -1))
    } else if (name === "dot") {
      setTyped((prev) => prev + ".")
    } else {
      setTyped((prev) => prev + name)
    }
  }

  useEffect(() => {
    logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight
    typedBoxRef.current.scrollTop = typedBoxRef.current.scrollHeight
  }, [log, typed])

  const onKeyDown = (event) => {
    event.preventDefault()
    const key = event.key
    if (key === "Enter" || key === "=") {
      try {
        eval(typed)
        setLog([...log, typed, `=${eval(typed)}`])
        setTyped((prev) => eval(prev))
      } catch {
        console.log("error")
      }
    } else if (key === "Escape") {
      setTyped("")
    } else if (key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1))
    } else if (key in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
      setTyped((prev) => prev + key)
    } else if (
      key === "." ||
      key === "+" ||
      key === "-" ||
      key === "*" ||
      key === "/" ||
      key === "%" ||
      key === "(" ||
      key === ")"
    ) {
      setTyped((prev) => prev + key)
    }
    console.log(typed)
  }

  return (
    <div className="App" onKeyDown={onKeyDown}>
      <div className="title">저장소</div>
      <div className="memo">memo</div>
      <div className="title">계산기록</div>
      <div className="log" ref={logBoxRef}>
        {log.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <div className="title">CalcuLog</div>
      <div className="typed" ref={typedBoxRef}>
        {typed}
      </div>
      <div className="buttons">
        <button className="keypad" name="clear" onClick={onClick}>
          Clear<div style={{ fontSize: "8px" }}>[esc]</div>
        </button>
        <button className="keypad" name="back" onClick={onClick}>
          ⬅
        </button>
        <button className="keypad" name="(" onClick={onClick}>
          (
        </button>
        <button className="keypad" name=")" onClick={onClick}>
          )
        </button>
        <button className="keypad" name="%" onClick={onClick}>
          %<div style={{ fontSize: "8px" }}>나머지</div>
        </button>
        <button className="keypad" name="" onClick={onClick}>
          ?
        </button>
        <button className="keypad" name="7" onClick={onClick}>
          7
        </button>
        <button className="keypad" name="8" onClick={onClick}>
          8
        </button>
        <button className="keypad" name="9" onClick={onClick}>
          9
        </button>
        <button className="keypad" name="+" onClick={onClick}>
          +
        </button>
        <button className="keypad" name="" onClick={onClick}>
          ?
        </button>
        <button className="keypad" name="4" onClick={onClick}>
          4
        </button>
        <button className="keypad" name="5" onClick={onClick}>
          5
        </button>
        <button className="keypad" name="6" onClick={onClick}>
          6
        </button>
        <button className="keypad" name="-" onClick={onClick}>
          -
        </button>
        <button className="keypad" name="" onClick={onClick}>
          ?
        </button>
        <button className="keypad" name="1" onClick={onClick}>
          1
        </button>
        <button className="keypad" name="2" onClick={onClick}>
          2
        </button>
        <button className="keypad" name="3" onClick={onClick}>
          3
        </button>
        <button className="keypad" name="*" onClick={onClick}>
          *
        </button>
        <button className="keypad" name="" onClick={onClick}>
          ?
        </button>
        <button className="keypad" name="0" onClick={onClick}>
          0
        </button>
        <button className="keypad" name="dot" onClick={onClick}>
          .
        </button>
        <button className="keypad" name="=" onClick={onClick}>
          =
        </button>
        <button className="keypad" name="/" onClick={onClick}>
          /
        </button>
      </div>
    </div>
  )
}

export default App
