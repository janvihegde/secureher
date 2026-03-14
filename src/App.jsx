import { useState, useEffect } from "react"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"

const KEYWORDS = ["help", "danger", "save me", "i am not safe"]

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )
  const [isListening, setIsListening] = useState(true)
  const [transcript, setTranscript] = useState("")
  const [keywordAlert, setKeywordAlert] = useState("")

  const triggerEmergency = () => {
    console.log("Emergency triggered")
    getLocation()
    startRecording()
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          console.log("Location fetched", lat, lng)
          sendAlert(lat, lng)
        },
        (error) => {
          console.error("Location permission denied or error:", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  const startRecording = () => {
    console.log("Recording started...")
    // Function to start recording goes here
  }

  const sendAlert = async (lat, lng) => {
    try {
      await fetch("http://localhost:5000/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng })
      })
      console.log("Alert sent to backend")
    } catch (error) {
      console.error("Error sending alert:", error)
    }
  }

  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      let currentTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript
      }

      const lowerTranscript = currentTranscript.toLowerCase()
      setTranscript(lowerTranscript)

      const matched = KEYWORDS.find((keyword) => lowerTranscript.includes(keyword))
      if (matched) {
        setKeywordAlert(`🚨 Keyword detected: "${matched}"`)
        triggerEmergency()
      }
    }

    recognition.onend = () => {
      // Restart automatically if it stops
      try {
        recognition.start()
      } catch (error) {
        console.error("Failed to restart recognition:", error)
      }
    }

    try {
      recognition.start()
    } catch (error) {
      console.error("Failed to start speech recognition:", error)
    }

    return () => {
      recognition.onend = null // Prevent restarting when component unmounts
      recognition.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening])

  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#ffe6e6" }}>
        {isListening ? (
          <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
            SecureHer Active — Listening for keywords...
          </p>
        ) : (
          <button
            onClick={() => setIsListening(true)}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "5px" }}
          >
            Start Listener
          </button>
        )}
        {isListening && (
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
            🎙️ Hearing: <em>{transcript || "..."}</em>
          </p>
        )}
        {keywordAlert && (
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "darkred", fontWeight: "bold", backgroundColor: "#ffcccc", padding: "6px", borderRadius: "4px" }}>
            {keywordAlert}
          </p>
        )}
      </div>

      {!user ?
        <Register setUser={setUser} />
        :
        <Dashboard />
      }
    </div>
  )
}

export default App