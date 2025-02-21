export default function Loading() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#4B0099] to-[#2D0066] flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="text-white text-center">
        <h1 className="text-4xl font-medium mb-1">Quad</h1>
        <p className="text-sm tracking-[0.2em] uppercase">Health</p>
      </div>
    </div>
  )
}

