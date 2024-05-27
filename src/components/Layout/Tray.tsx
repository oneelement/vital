import CrossIcon from "../UI/Icons/CrossIcon"

type ChildrenProps = {
  children: React.ReactNode,
  open?: boolean,
  onClose?: () => void
}

export default function Tray ({ children, open = false, onClose }: ChildrenProps) {
  const handleClose = () => {
    onClose && onClose()
  }

  return (
    <aside className={`fixed top-0 bottom-0 right-0 overflow-hidden ${open ? 'w-[400px]' : 'w-0'}`}>
      <div className="pt-8 px-4 h-full border-l">
        <button onClick={handleClose} className="absolute top-8 right-4 hover:bg-gray-200 p-2 rounded-md" aria-label="Close tray">
          <CrossIcon className="h-4 w-4" />
        </button>
        {children}
      </div>
    </aside>
  )
}
