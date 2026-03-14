import { useRef } from "react"

function CameraRecorder() {
    const videoRef = useRef(null)

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        videoRef.current.srcObject = stream
        const recorder = new MediaRecorder(stream)
        let chunks = []
        recorder.ondataavailable = (e) => { chunks.push(e.data) }
        recorder.start()
        setTimeout(() => { recorder.stop() }, 10000)
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative group">
                <video
                    ref={videoRef}
                    autoPlay
                    muted /* Muted for preview to avoid feedback */
                    className="w-full max-w-sm aspect-video rounded-2xl border-4 border-white shadow-2xl object-cover bg-black"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-[10px] text-white uppercase tracking-widest">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Live
                </div>
            </div>

            <button
                onClick={startCamera}
                className="bg-[#C1536B] hover:bg-[#a34156] text-white px-8 py-2 mt-4 rounded-full font-bold shadow-lg transition-all active:scale-95"
            >
                Start Recording
            </button>
        </div>
    )
}

export default CameraRecorder