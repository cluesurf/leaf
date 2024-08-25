import React from 'react'
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip'

export default function Tooltip({
  children,
  place,
  id,
}: {
  children: React.ReactNode
  place?: PlacesType
  id: string
}) {
  return (
    <ReactTooltip
      id={id}
      place={place}
      className="will-change-transform-opacity bg-gray-50 rounded-sm p-16"
    >
      {children}
    </ReactTooltip>
  )
}
