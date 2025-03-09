import React from 'react'

interface TooltipProps {
  message: string
  position: { x: number; y: number }
}

export const Tooltip: React.FC<TooltipProps> = ({ message, position }) => {
  return (
    <div
      className="absolute bg-gray-800 text-white px-3 py-1 rounded-md text-sm z-50"
      style={{
        top: `${position.y + 10}px`,
        left: `${position.x + 10}px`,
      }}
    >
      {message}
      <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-800 transform rotate-45" />
    </div>
  )
}
