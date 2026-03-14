import CameraRecorder from "./CameraRecorder"
import MapView from "./MapView"
import logo from "../assets/logo.png"


function Dashboard() {
    const handleSOS = async () => {

    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || !user.name || !user.emergencyContacts) {
      alert("User not registered")
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

          stream.getTracks().forEach(track => track.stop())

        }, 5000)

      })

    } catch (error) {
      console.error(error)
      alert("Error sending SOS")
    }

  }
    return (
        /* Added animated-bg and min-h-screen to match the Register page */

        <div className="min-h-screen animated-bg flex flex-col items-center p-4">

            <nav className="self-start w-full backdrop-blur-md bg-white/30 rounded-xl p-4 shadow-sm border border-white/20 flex justify-between items-center">
                
                <h1 className="font-bold text-xl ml-2 opacity-70">
                    Dashboard
                </h1>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </nav>

           
            <div className="w-full flex justify-center mb-8 mt-10">
                <CameraRecorder />
            </div>

            {/* 2. Map Second (Small Rectangle) */}
            <div className="w-full max-w-2xl">
                <MapView />
            </div>

            <p className="mt-10 text-xs text-gray-500 italic">SecureHer v1.0 </p>
        </div>
    )
}

export default Dashboard