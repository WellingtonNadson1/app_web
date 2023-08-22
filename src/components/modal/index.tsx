import { X } from '@phosphor-icons/react'
import React from 'react'

function Modal({
  isVisible,
  onClose,
  children,
}: {
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isVisible) {
    return null
  }
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.id === 'wrapper') onClose()
  }
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[600]">
        <div className="rounded bg-white p-2">
          <header className="flex items-center justify-between">
            <div>Cadastro de Eventos</div>
            <X onClick={() => onClose()} />
          </header>
          <body>{children}</body>
        </div>
      </div>
    </div>
  )
}

export default Modal
