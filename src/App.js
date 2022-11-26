import { useState, useRef, useEffect } from "react"
import { DeleteForever, SmartButton, ArrowBack } from "@styled-icons/material"
import "./App.css"

const numComma = (num) => {
  const str = typeof num === "number" ? num.toString.split(".") : num.split(".")
  if (str.length > 2) {
    alert("wrong input")
    return `${num} `
  } else if (str.length === 1) {
    return `${str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")} `
  } else {
    return `${str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${str[1]} `
  }
}

function App() {
  const logBoxRef = useRef(null)
  const typedBoxRef = useRef(null)
  const empty = ["", "", "", "", "", ""]
  const [quickNum, setQuickNum] = useState([])
  const [log, setLog] = useState([])
  const [typed, setTyped] = useState("")
  const [ans, setAns] = useState("")
  const clicked = useRef(false)
  const keydownRef = useRef(null)

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

    if (!clicked.current) {
      if (name === "=") {
        calc()
      } else if (name === "clear") {
        setTyped("")
      } else if (name === "back") {
        setTyped((prev) => prev.slice(0, -1))
      } else if (name === "del") {
        setLog([])
      } else if (name === "remove") {
        setQuickNum((prev) => [])
      } else if (name === "write") {
        ans2btn()
      } else if (name === "ans") {
        setTyped((prev) => `${prev}(${ans})`)
      } else if (name === "dot") {
        setTyped((prev) => prev + ".")
      } else if (name !== undefined) {
        setTyped((prev) => prev + name)
      }
    }
    clicked.current = true
    setTimeout(() => {
      clicked.current = false
    }, 100)
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
      setLog([])
    } else if (key === "R" || key === "r") {
      setQuickNum([])
    } else if (key === "W" || key === "w") {
      ans2btn()
    } else if (key === "A" || key === "a") {
      setTyped((prev) => `${prev}(${ans})`)
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
      key === ")" ||
      key === "E" ||
      key === "e"
    ) {
      setTyped((prev) => prev + key)
    }
  }

  useEffect(() => {
    keydownRef.current.focus()
  }, [])

  return (
    <div className="App" ref={keydownRef} tabIndex={0} onKeyDown={onKeyDown}>
      {/* QUICK NUMBER  */}
      <div className="quick_numbers">
        {quickNum.map((num, index) => (
          <div className="quick_number" key={index}>
            <div
              onClick={() => setTyped((prev) => `${prev}(${quickNum[index]})`)}
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
      {/* LOG */}
      <div className="log-box">
        <div className="log" ref={logBoxRef}>
          {log.map((line, index) => (
            <div key={index}>
              {line[0] === "=" ? "= " + numComma(line.slice(1)) : line}
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
        </div>
        <div className="log-title">Log of Calc</div>
      </div>
      {/* TYPED */}
      <div className="typed" ref={typedBoxRef}>
        {typed}
        <span style={{ animation: "blink-effect 1s step-end infinite" }}>
          _
        </span>
      </div>
      {/* KEYPAD */}
      <div className="keypads">
        <button
          className="keypad"
          name="clear"
          onClick={onClick}
          style={{ backgroundColor: "#393E46", color: "white" }}
        >
          Clear
          <button
            className="keypad-info"
            name="clear"
            onClick={onClick}
            style={{ backgroundColor: "#393E46", color: "white" }}
          >
            [esc]
          </button>
        </button>
        <button className="keypad" name="(" onClick={onClick}>
          (
        </button>
        <button className="keypad" name=")" onClick={onClick}>
          )
        </button>
        <button
          className="keypad"
          name="back"
          onClick={onClick}
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          ←
          <button
            className="keypad-info"
            name="back"
            onClick={onClick}
            style={{ backgroundColor: "#ddd", color: "black" }}
          >
            [BS]
          </button>
        </button>
        <button className="keypad" name="e" onClick={onClick}>
          e
          <button
            className="keypad-info"
            name="e"
            onClick={onClick}
            style={{ backgroundColor: "#ddd", color: "black" }}
          >
            1.2e+3
          </button>
        </button>
        <button
          className="keypad"
          name="del"
          onClick={onClick}
          style={{ backgroundColor: "#7D5A5A", color: "white" }}
        >
          Del
          <button
            className="keypad-info"
            name="del"
            onClick={onClick}
            style={{ backgroundColor: "#7D5A5A", color: "white" }}
          >
            Log
          </button>
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
          name="remove"
          onClick={onClick}
          style={{ backgroundColor: "#0F4C75", color: "white" }}
        >
          Remove
          <button
            className="keypad-info"
            name="remove"
            onClick={onClick}
            style={{ backgroundColor: "#0F4C75", color: "white" }}
          >
            QuickNum
          </button>
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
          style={{
            backgroundColor: "#3282B8",
            color: "white",
          }}
        >
          Write
          <button
            className="keypad-info"
            name="write"
            onClick={onClick}
            style={{
              backgroundColor: "#3282B8",
              color: "white",
            }}
          >
            QuickNum
          </button>
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
          <button
            className="keypad-info"
            name="ans"
            onClick={onClick}
            style={{ backgroundColor: "#285430", color: "white" }}
          >
            {ans ? (ans.length > 9 ? `${ans.slice(0, 8)}…` : ans) : "직전답"}
          </button>
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

      <style jsx>
        {`
          .App {
            position: relative;
            width: 360px;
            height: ${document.documentElement.clientHeight}px;
            border-radius: 10px;
            background-color: #222;
            color: white;
            text-align: center;
          }

          .log-box {
            position: relative;
            height: ${document.documentElement.clientHeight - 450}px;
            margin: 2px;
            border-radius: 5px;
            padding: 5px 0 5px 10px;
            background-color: #fff5e4;
            color: black;
            text-align: left;
            font-size: 18px;
            word-break: break-all;
          }
          .log {
            height: ${document.documentElement.clientHeight - 460}px;
            overflow-y: auto;
          }
        `}
      </style>
    </div>
  )
}

export default App
