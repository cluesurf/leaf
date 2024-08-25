// import React, { useEffect, useState } from 'react'
// import { createPortal } from 'react-dom'
// import C from '~/code/classes'

// type OverlayPropsType = {
//   children: React.ReactNode
//   onClose?: () => void
// }

// export function Container({ children, ...props }: ContainerProps) {
//   const list = [
//     C.animationFadeIn,
//     C.backgroundFillBaseContrastOpacity8,
//     C.bottom0,
//     C.opacity1,
//     C.padding16,
//     C.positionFixed,
//     C.top0,
//     C.width100P,
//     C.zIndex1000,
//   ]
//   return (
//     <div
//       {...props}
//       className={list.join(' ')}
//     >
//       {children}
//     </div>
//   )
// }

// export type ContainerProps = React.ComponentPropsWithoutRef<'div'> & {
//   children: React.ReactNode
// }

// export function Content({ children, ...props }: ContentProps) {
//   const list = [
//     C.flex,
//     C.alignCenter,
//     C.justifyCenter,
//     C.height100P,
//     C.width100P,
//   ]
//   return (
//     <div
//       {...props}
//       className={list.join(' ')}
//     >
//       {children}
//     </div>
//   )
// }

// export type ContentProps = React.ComponentPropsWithoutRef<'div'> & {
//   children: React.ReactNode
// }

// export default function Overlay({
//   children,
//   onClose,
// }: OverlayPropsType) {
//   const [shown, setShown] = useState(true)

//   useEffect(() => {
//     document.body.style.overflow = 'hidden'

//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setShown(false)
//         onClose?.()
//       }
//     }

//     window.addEventListener('keyup', handleKeyUp)

//     return () => {
//       document.body.style.overflow = 'initial'

//       window.removeEventListener('keyup', handleKeyUp)
//     }
//   }, [onClose])

//   const handleClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setShown(false)
//       onClose?.()
//     }
//   }

//   const handleDoubleClick = (e: React.MouseEvent) => {
//     setShown(false)
//     onClose?.()
//   }

//   return createPortal(
//     <Container onClick={handleClick}>
//       <Content
//         onClick={handleClick}
//         onDoubleClick={handleDoubleClick}
//       >
//         {children}
//       </Content>
//     </Container>,
//     document?.querySelector('#overlay') ??
//       document?.createElement('div'),
//   )
// }
