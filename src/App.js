import { useState, useRef, useEffect } from "react"
import { DeleteForever, SmartButton } from "@styled-icons/material"
import "./App.css"

const numComma = (num) => {
  const str = typeof num === "number" ? num.toString.split(".") : num.split(".")
  if (str.length > 2) {
    alert("wrong input")
    return `${num} `
  } else if (str.length === 1) {
    return `${str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  } else {
    return `${str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${str[1]}`
  }
}

function App() {
  const [viewHeight, setViewHeight] = useState(
    document.documentElement.clientHeight < 500
      ? 500
      : document.documentElement.clientHeight
  )
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
  const [confirmMethod, setConfirmMethod] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const calc = () => {
    if (typed !== "") {
      try {
        if (typed.includes("//")) {
          throw "//"
        }
        const answerPre = `${eval(typed)}`
        const answer =
          answerPre.split(".").length === 2
            ? `${Number(Number(answerPre).toFixed(9))}`
            : answerPre
        setAns(answer)
        window.localStorage.setItem("ans", JSON.stringify(answer))

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
          alert("빠른입력에 같은 수가 있습니다")
        } else {
          const newQuickNum = [...quickNum, ans]
          setQuickNum(newQuickNum)
          window.localStorage.setItem("quickNum", JSON.stringify(newQuickNum))
        }
      } else {
        alert("빠른입력이 모두 사용중입니다")
      }
    }
  }

  const inputQuickNum = (index) => {
    quickNum[index][0] === "-"
      ? setTyped((prev) => `${prev}(${quickNum[index]})`)
      : setTyped((prev) => `${prev}${quickNum[index]}`)
  }

  const inputAns = (index) => {
    ans[0] === "-"
      ? setTyped((prev) => `${prev}(${ans})`)
      : setTyped((prev) => `${prev}${ans}`)
  }

  const deleteLog = () => {
    setLog([])
    window.localStorage.setItem("log", JSON.stringify([]))
    setAns("")
    window.localStorage.setItem("ans", "")
  }

  const removeQuickNum = () => {
    setQuickNum((prev) => [])
    window.localStorage.setItem("quickNum", JSON.stringify([]))
  }

  const confirmNo = () => {
    setConfirmMethod(null)
    setShowConfirm(false)
  }

  const confirmYes = () => {
    if (confirmMethod === "del") {
      deleteLog()
    } else if (confirmMethod === "remove") {
      removeQuickNum()
    }
    setConfirmMethod(null)
    setShowConfirm(false)
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
        if (JSON.stringify(log) !== JSON.stringify([])) {
          setConfirmMethod("del")
          setShowConfirm(true)
        }
      } else if (name === "remove") {
        if (JSON.stringify(quickNum) !== JSON.stringify([])) {
          setConfirmMethod("remove")
          setShowConfirm(true)
        }
      } else if (name === "write") {
        ans2btn()
      } else if (name === "ans") {
        inputAns()
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

  const onKeyDown = (event) => {
    // event.preventDefault()
    const key = event.key

    if (confirmMethod) {
      if (
        ((key === "N" || key === "n") && !event.ctrlKey) ||
        key === "Escape"
      ) {
        confirmNo()
      } else if (
        ((key === "Y" || key === "y") && !event.ctrlKey) ||
        key === "Enter"
      ) {
        confirmYes()
      }
    } else {
      if (key === "Enter" || key === "=") {
        calc()
      } else if (
        (key === "Escape" || key === "C" || key === "c") &&
        !event.ctrlKey
      ) {
        setTyped("")
      } else if (key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1))
      } else if (
        (key === "Delete" || key === "D" || key === "d") &&
        JSON.stringify(log) !== JSON.stringify([])
      ) {
        setConfirmMethod("del")
        setShowConfirm(true)
      } else if (
        (key === "R" || key === "r") &&
        !event.ctrlKey &&
        JSON.stringify(quickNum) !== JSON.stringify([])
      ) {
        setConfirmMethod("remove")
        setShowConfirm(true)
      } else if (key === "W" || key === "w") {
        ans2btn()
      } else if (key === "A" || key === "a") {
        inputAns()
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
        inputQuickNum(0)
      } else if (key === "@" && quickNum.length >= 2) {
        inputQuickNum(1)
      } else if (key === "#" && quickNum.length >= 3) {
        inputQuickNum(2)
      } else if (key === "$" && quickNum.length >= 4) {
        inputQuickNum(3)
      } else if (key === "%" && quickNum.length >= 5) {
        inputQuickNum(4)
      } else if (key === "^" && quickNum.length >= 6) {
        inputQuickNum(5)
      }
    }
  }

  useEffect(() => {
    logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight
    typedBoxRef.current.scrollTop = typedBoxRef.current.scrollHeight
  }, [log, typed])

  useEffect(() => {
    window.addEventListener("resize", () => {
      setViewHeight(
        document.documentElement.clientHeight < 500
          ? 500
          : document.documentElement.clientHeight
      )
    })
    const quickNumberLS = JSON.parse(window.localStorage.getItem("quickNum"))
    setQuickNum(quickNumberLS ? quickNumberLS : [])
    const logLS = JSON.parse(window.localStorage.getItem("log"))
    setLog(logLS ? logLS : [])
    const ansLS = window.localStorage.getItem("ans")
    setAns(ansLS ? JSON.parse(ansLS) : "")
    keydownRef.current.focus()
  }, [])

  return (
    <div className="App" ref={keydownRef} tabIndex={0} onKeyDown={onKeyDown}>
      <div className="Container">
        {/* QUICK NUMBER  */}
        <div className="quick_numbers">
          {quickNum.map((num, index) => (
            <div className="quick_number" key={index}>
              <div
                onClick={() => inputQuickNum(index)}
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
              <div className="log-line" key={index}>
                {line[0] === "=" ? (
                  <div className="log-calculated">
                    =&nbsp;
                    <span className="log-answer">
                      {numComma(line.slice(1))}
                    </span>
                    {index === log.length - 1 ? (
                      <>
                        &nbsp;
                        <SmartButton
                          size="24"
                          color="#285430"
                          onClick={ans2btn}
                          style={{ cursor: "pointer" }}
                        />
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="log-equation">{line}</div>
                )}
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
          <button className="keypad" name="+" onClick={onClick}>
            +
          </button>
          <button className="keypad" name="-" onClick={onClick}>
            -
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
          <button className="keypad" name="*" onClick={onClick}>
            *
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
          <button className="keypad" name="/" onClick={onClick}>
            /
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
        </div>
        {/* FOOTER & LOGO */}
        <div className="logo">
          <button
            className="usage-btn"
            tabIndex={-1}
            onClick={() => {
              setShowUsage(true)
            }}
          >
            ⓘ
          </button>
          calculog
        </div>
        {/* USAGE */}
        <button
          className="usage"
          tabIndex={-1}
          onClick={() => {
            setShowUsage(false)
          }}
        >
          사용법
          <ul>
            <li>키패드 클릭 또는 터치</li>
            <li>
              키보드 입력
              <br />- 입력이 안될 땐 <code>Tab</code>
            </li>
            <li>소수점아래는 최대 9자리로 반올림됨</li>
          </ul>
          단축키
          <ul>
            <li>
              <code>Enter</code> : =
            </li>
            <li>
              <code>ESC</code>, <code>C</code>, <code>c</code> : 입력창 삭제
            </li>
            <li>
              <code>BackSpace</code> : 입력창 한글자 삭제
            </li>
            <li>
              <code>D</code>, <code>d</code> : 계산기록(Log) 삭제
            </li>
            <li>
              <code>R</code>, <code>r</code>
              <br />: 빠른입력(Quick Number) 삭제
            </li>
            <li>
              <code>W</code>, <code>w</code> : 최근답을 빠른입력버튼에 기록
            </li>
            <li>
              <code>A</code>, <code>a</code> : 최근답(ANS)
            </li>
            <li>
              <code>Shift</code> + <code>1</code>,<code>2</code>,<code>3</code>,
              <code>4</code>,<code>5</code>,<code>6</code>
              <br />: 빠른입력 1,2,3,4,5,6
            </li>
            <li>
              계산기록, 빠른입력 삭제 확인창
              <ul>
                <li>
                  <code>Y</code>, <code>y</code>, <code>Enter</code> : 확인
                </li>
                <li>
                  <code>N</code>, <code>n</code>, <code>ESC</code> : 취소
                </li>
              </ul>
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
        {/* CONFIRM */}
        <div className="confirm">
          <div className="confirm-grid">
            {confirmMethod === "del" ? "계산기록을 " : null}
            {confirmMethod === "remove" ? "빠른입력을 " : null}
            모두 삭제할까요?
            <br />
            <button
              className="confirm-button"
              tabIndex={-1}
              name="no"
              onClick={confirmNo}
            >
              아니요(N)
            </button>
            <button
              className="confirm-button"
              tabIndex={-1}
              name="yes"
              onClick={confirmYes}
            >
              네(Y)
            </button>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .App {
            width: 100vw;
            height: ${viewHeight}px;
            min-height: 500px;
            display: flex;
            justify-content: center;
            background-color: #333;
          }
          .log-box {
            position: relative;
            height: ${viewHeight - 450}px;
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
            height: ${viewHeight - 460}px;
            overflow-y: auto;
          }

          .usage {
            position: absolute;
            z-index: ${showUsage ? "10" : "-10"};
            bottom: 0;
            left: 0;
            width: 340px;
            height: 500px;
            margin: 10px;
            border-radius: 20px;
            border: none;
            padding: 10px;
            background-color: #333;
            color: white;
            opacity: 0.8;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
          }

          .confirm {
            position: fixed;
            z-index: ${showConfirm ? "10" : "-10"};
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #333;
            color: white;
            opacity: 0.9;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  )
}

export default App
