import { useState } from "react"
import logo from "../assets/logo.png"

function Register({ setUser }) {

    const [name, setName] = useState("")
    const [contacts, setContacts] = useState("")
    const [keywords, setKeywords] = useState("")


    // 🎤 START LISTENING FOR KEYWORDS
    const startListening = () => {

        const user = JSON.parse(localStorage.getItem("user"))

        if (!user || !user.keywords) return

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition

        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = false

        recognition.onresult = (event) => {

            const speech =
                event.results[event.results.length - 1][0].transcript.toLowerCase()

            console.log("Heard:", speech)

            // check if spoken word matches keyword
            const detected = user.keywords.some((word) =>
                speech.includes(word)
            )

            if (detected) {
                alert("🚨 SOS keyword detected!")
                handleSOS()
            }
        }

        recognition.start()
    }


    // REGISTER USER
    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = {
            name,
            emergencyContacts: contacts.split(",").map(c => c.trim()),
            keywords: keywords.split(",").map(k => k.trim().toLowerCase())
        }

        // save in browser
        localStorage.setItem("user", JSON.stringify(data))

        // update React state
        setUser(data)

        // send to backend
        await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        // start listening after registration
        startListening()
    }



    // SOS BUTTON FUNCTION
    const handleSOS = async () => {

        const user = JSON.parse(localStorage.getItem("user"))

        if (!user || !user.name || !user.emergencyContacts || user.emergencyContacts.length === 0) {
            alert("Please register first by entering your name and emergency contact numbers.")
            return
        }

        try {

            navigator.geolocation.getCurrentPosition(async (position) => {

                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

                const recorder = new MediaRecorder(stream)

                let chunks = []

                recorder.ondataavailable = (event) => {
                    chunks.push(event.data)
                }

                recorder.start()

                setTimeout(async () => {

                    recorder.stop()

                    const audioBlob = new Blob(chunks, { type: "audio/webm" })

                    const formData = new FormData()

                    formData.append("name", user.name)
                    formData.append("location", JSON.stringify(location))
                    formData.append("contacts", JSON.stringify(user.emergencyContacts))
                    formData.append("audio", audioBlob)

                    await fetch("http://localhost:5000/sos", {
                        method: "POST",
                        body: formData
                    })

                    alert("🚨 SOS alert sent successfully!")

                    // stop mic
                    stream.getTracks().forEach(track => track.stop())

                }, 5000)

            }, () => {
                alert("Unable to access location. Please enable GPS.")
            })

        } catch (error) {

            console.error(error)
            alert("Something went wrong while sending SOS.")

        }

    }


    return (


        <div className="flex flex-col items-center justify-center min-h-screen animated-bg">
         
            <img
                src={logo}
                alt="SecureHer Logo"
                className="max-w-xs"
            />

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-96"
            >

                <h2 className="text-xl font-bold mb-6 text-center ">
                    User Registration
                </h2>

                <input
                    className="border-b p-2 w-full mb-3"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="border-b p-2 w-full mb-3"
                    placeholder="Emergency Contacts (comma separated)"
                    onChange={(e) => setContacts(e.target.value)}
                />

                <input
                    className="border-b p-2 w-full mb-3 "
                    placeholder="SOS Keywords (help,danger)"
                    onChange={(e) => setKeywords(e.target.value)}
                />

                <button className="bg-[#C1536B] text-white w-full p-2 mt-5 rounded">
                    Register
                </button>

            </form>


           

            <button
                onClick={handleSOS}
                className="bg-red-700 text-white text-2xl px-12 py-4 rounded-full shadow-lg hover:bg-red-800 mt-10 mb-10"
            >
                🚨 SOS
            </button>

        </div>
    )
}

export default Register