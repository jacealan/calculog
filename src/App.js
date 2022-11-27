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
  const [showUsage, setShowUsage] = useState(false)

  const calc = () => {
    if (typed !== "") {
      try {
        const answerPre = `${eval(typed)}`
        const answer =
          answerPre.split(".").length === 2
            ? `${Number(Number(answerPre).toFixed(9))}`
            : answerPre
        setAns(answer)

        const newLog = [...log, typed, `=${answer}`]
        setLog(newLog)
        window.localStorage.setItem("log", JSON.stringify(newLog))

        setTyped(answer)
      } catch {
        alert("수식(숫자) 수정이 필요합니다")
      }
    }
  }

  const ans2btn = () => {
    if (ans !== "") {
      if (quickNum.length < 6) {
        if (quickNum.includes(ans)) {
          alert("빠른입력버튼에 같은 수가 있습니다")
        } else {
          const newQuickNum = [...quickNum, ans]
          setQuickNum(newQuickNum)
          window.localStorage.setItem("quickNum", JSON.stringify(newQuickNum))
        }
      } else {
        alert("빠른입력버튼이 모두 사용중입니다")
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
        window.localStorage.setItem("log", JSON.stringify([]))
      } else if (name === "remove") {
        setQuickNum((prev) => [])
        window.localStorage.setItem("quickNum", JSON.stringify([]))
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
  }, [quickNum, log, typed])

  const onKeyDown = (event) => {
    event.preventDefault()
    const key = event.key

    if (key === "Enter" || key === "=") {
      calc()
    } else if (
      (key === "Escape" || key === "C" || key === "c") &&
      !event.ctrlKey
    ) {
      setTyped("")
    } else if (key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1))
    } else if (key === "Delete" || key === "D" || key === "d") {
      setLog([])
      window.localStorage.setItem("log", JSON.stringify([]))
    } else if ((key === "R" || key === "r") && !event.ctrlKey) {
      setQuickNum([])
      window.localStorage.setItem("quickNum", JSON.stringify([]))
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
    } else if (key === "!" && quickNum.length >= 1) {
      setTyped((prev) => `${prev}(${quickNum[0]})`)
    } else if (key === "@" && quickNum.length >= 2) {
      setTyped((prev) => `${prev}(${quickNum[1]})`)
    } else if (key === "#" && quickNum.length >= 3) {
      setTyped((prev) => `${prev}(${quickNum[2]})`)
    } else if (key === "$" && quickNum.length >= 4) {
      setTyped((prev) => `${prev}(${quickNum[3]})`)
    } else if (key === "%" && quickNum.length >= 5) {
      setTyped((prev) => `${prev}(${quickNum[4]})`)
    } else if (key === "^" && quickNum.length >= 6) {
      setTyped((prev) => `${prev}(${quickNum[5]})`)
    }
  }

  useEffect(() => {
    const quickNumberLS = JSON.parse(window.localStorage.getItem("quickNum"))
    setQuickNum(quickNumberLS ? quickNumberLS : [])
    const logLS = JSON.parse(window.localStorage.getItem("log"))
    setLog(logLS ? logLS : [])
    keydownRef.current.focus()
  }, [])

  return (
    <div className="App" ref={keydownRef} tabIndex={0} onKeyDown={onKeyDown}>
      {/* QUICK NUMBER  */}
      <div className="quick_numbers">
        {quickNum.map((num, index) => (
          <div className="quick_number" key={index}>
            <div
              onClick={() =>
                quickNum[index][0] === "-"
                  ? setTyped((prev) => `${prev}(${quickNum[index]})`)
                  : setTyped((prev) => `${prev}${quickNum[index]}`)
              }
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
                setQuickNum(newQuickNum)
                window.localStorage.setItem(
                  "quickNum",
                  JSON.stringify(newQuickNum)
                )
              }}
            />
          </div>
        ))}

        {empty.slice(0, 6 - quickNum.length).map((num, index) => (
          <div className="quick_number_empty" key={index}>
            {/* Quick Number {index + quickNum.length + 1} */}
            빠른입력 {index + quickNum.length + 1}
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
        {/* <div className="log-title">Log of Calc</div> */}
        <div className="log-title">계산기록</div>
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
            [ESC]
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
            {/* Log */}
            계산기록
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
            {/* QuickNum */}
            빠른입력
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
            {/* QuickNum */}
            빠른입력
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
            {ans ? (ans.length > 9 ? `${ans.slice(0, 8)}…` : ans) : "최근답"}
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
      <div className="logo">
        <button
          className="usage-btn"
          onClick={() => {
            setShowUsage(true)
          }}
        >
          ⓘ
        </button>
        calculog
      </div>
      <button
        className="usage"
        onClick={() => {
          setShowUsage(false)
        }}
      >
        사용법
        <ul>
          <li>키패드 클릭 또는 터치</li>
          <li>
            키보드 입력
            <br />- 입력이 안될 땐 Tab
          </li>
          <li>소수점아래는 최대 9자리로 반올림됨</li>
        </ul>
        단축키
        <ul>
          <li>Enter : =</li>
          <li>ESC, C, c : 입력창 지우기</li>
          <li>BackSpace : 입력창 한글자 지우기</li>
          <li>D, d : 계산기록(Log) 지우기</li>
          <li>
            R, r
            <br />: 빠른입력(Quick Number) 지우기
          </li>
          <li>W, r : 최근답을 빠른입력버튼에 기록</li>
          <li>A, a : 최근답(ANS)</li>
          <li>
            Shift + 1,2,3,4,5,6
            <br />: 빠른입력 1,2,3,4,5,6
          </li>
        </ul>
        &copy; Jace(제이스) {new Date().getFullYear()}{" "}
        <a
          href="mailto:jacealan1@gmail.com"
          style={{ fontSize: "12px", fontWeight: "300" }}
        >
          (contact)
        </a>
      </button>

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

          .usage {
            position: absolute;
            z-index: 10;
            bottom: 0;
            left: 0;
            width: 340px;
            height: 400px;
            margin: 10px;
            border-radius: 20px;
            border: none;
            padding: 10px;
            background-color: #333;
            color: white;
            opacity: 0.8;
            display: ${showUsage ? "block" : "none"};
            text-align: left;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  )
}

export default App
