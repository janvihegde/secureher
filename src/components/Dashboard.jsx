import CameraRecorder from "./CameraRecorder"
import MapView from "./MapView"
import logo from "../assets/logo.png"

function Dashboard() {
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