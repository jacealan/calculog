import { useState, useRef, useEffect } from "react"
import { DeleteForever, SmartButton, ArrowBack } from "@styled-icons/material"
import "./App.css"

function App() {
  const logBoxRef = useRef(null)
  const typedBoxRef = useRef(null)
  const empty = ["", "", "", "", "", ""]
  const [quickNum, setQuickNum] = useState([])
  const [log, setLog] = useState([])
  const [typed, setTyped] = useState("")
  const [ans, setAns] = useState("")

  const calc = () => {
    if (typed !== "") {
      try {
        const answer = `${eval(typed)}`
        setAns(answer)
        setLog([...log, typed, `=${answer}`])
        setTyped(answer)
      } catch {
        console.log("error")
      }
    }
  }

  const ans2btn = () => {
    if (ans !== "") {
      if (quickNum.length < 6) {
        if (quickNum.includes(ans)) {
          alert("there is")
        } else {
          const newQuickNum = [...quickNum, ans]
          setQuickNum(newQuickNum)
        }
      } else {
        alert("full")
      }
    }
  }

  const onClick = (event) => {
    const {
      target: { name },
    } = event

    if (name === "=") {
      calc()
    } else if (name === "clear") {
      setTyped("")
    } else if (name === "back") {
      setTyped((prev) => prev.slice(0, -1))
    } else if (name === "del") {
      setLog([])
    } else if (name === "erase") {
      setQuickNum((prev) => [])
    } else if (name === "write") {
      ans2btn()
    } else if (name === "ans") {
      setTyped((prev) => prev + ans)
    } else if (name === "dot") {
      setTyped((prev) => prev + ".")
    } else if (name !== undefined) {
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
      calc()
    } else if (key === "Escape") {
      setTyped("")
    } else if (key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1))
    } else if (key === "Delete" || key === "D" || key === "d") {
      setLog("")
    } else if (key === "E" || key === "e") {
      setQuickNum([])
    } else if (key === "W" || key === "w") {
      ans2btn()
    } else if (key === "A" || key === "a") {
      setTyped((prev) => prev + ans)
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
  }

  return (
    <div className="App" onKeyDown={onKeyDown}>
      {/* <div className="title">Quick Number</div> */}
      <div className="quick_numbers">
        {quickNum.map((num, index) => (
          <div className="quick_number" key={index}>
            <div
              onClick={() => setTyped((prev) => prev + quickNum[index])}
              style={{
                width: "100px",
                textAlign: "left",
                color: "white",
                cursor: "pointer",
              }}
            >
              {num.length > 8 ? `${num.slice(0, 7)}…` : num}
            </div>
            <DeleteForever
              size="24"
              color="#ddd"
              style={{ cursor: "pointer" }}
              onClick={() => {
                const newQuickNum = [...quickNum]
                newQuickNum.splice(index, 1)
                setQuickNum([...newQuickNum])
              }}
            />
          </div>
        ))}

        {empty.slice(0, 6 - quickNum.length).map((num, index) => (
          <div className="quick_number_empty" key={index}>
            Quick Number
          </div>
        ))}
      </div>
      {/* <div className="title">Log of Calc</div> */}
      <div className="log" ref={logBoxRef}>
        {log.map((line, index) => (
          <div key={index}>
            {line}
            {index === log.length - 1 ? (
              <SmartButton
                size="24"
                color="#285430"
                onClick={ans2btn}
                style={{ cursor: "pointer" }}
              />
            ) : null}
          </div>
        ))}
        <div className="log-title">Log of Calc</div>
      </div>
      <div className="typed" ref={typedBoxRef}>
        {typed}<span style={{ animation: "blink-effect 1s step-end infinite"}}>_</span>
      </div>
      <div className="buttons">
        <button
          className="keypad"
          name="clear"
          onClick={onClick}
          style={{ backgroundColor: "#393E46", color: "white" }}
        >
          Clear<div style={{ fontSize: "8px" }}>[esc]</div>
        </button>
        <button className="keypad" name="back" onClick={onClick}>
          <ArrowBack size="24"/>
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
        <button
          className="keypad"
          name="del"
          onClick={onClick}
          style={{ backgroundColor: "#7D5A5A", color: "white" }}
        >
          Del<div style={{ fontSize: "8px" }}>Log</div>
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
        <button
          className="keypad"
          name="erase"
          onClick={onClick}
          style={{ backgroundColor: "#0F4C75", color: "white" }}
        >
          Erase<div style={{ fontSize: "8px" }}>QuickNum</div>
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
        <button
          className="keypad"
          name="write"
          onClick={onClick}
          style={{ backgroundColor: "#3282B8", color: "white", paddingTop: "8px"  }}
        >
          Write<div style={{ fontSize: "8px"}}><SmartButton size="20" style={{marginTop: "-5px"}}/></div>
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
        <button
          className="keypad"
          name="ans"
          onClick={onClick}
          style={{ backgroundColor: "#285430", color: "white" }}
        >
          ANS
          <div style={{ fontSize: "8px" }}>
            {ans ? (ans.length > 9 ? `${ans.slice(0, 8)}…` : ans) : "직전답"}
          </div>
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
      <div className="logo">calculog</div>

      <style jsx>{`
        .App {
          position: relative;
          width: 360px;
          height: ${document.documentElement.clientHeight}px;
          border-radius: 10px;
          background-color: #222;
          color: white;
          text-align: center;
        }

        .log {
          position: relative;
          height: ${document.documentElement.clientHeight - 450}px;
          margin: 2px;
          border-radius: 5px;
          padding: 5px 10px;
          background-color: #fff5e4;
          color: black;
          text-align: left;
          font-size: 18px;
          word-break: break-all;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}

export default App
