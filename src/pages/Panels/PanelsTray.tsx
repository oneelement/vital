import CrossIcon from "../../components/UI/Icons/CrossIcon"

type PanelsTrayProps = {
  title: string,
  children: React.ReactNode,
  open?: boolean,
  onClose?: () => void
}

export default function PanelsTray ({ title, children, open = false, onClose }: PanelsTrayProps) {
  const handleClose = () => {
    onClose && onClose()
  }

  return (
    <aside className={`fixed top-0 bottom-0 right-0 bg-white overflow-hidden w-full sm:w-96 transform transition-transform duration-700 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full border-l">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl">{title}</h3>
          <button onClick={handleClose} className=" hover:bg-gray-200 p-2 rounded-md" aria-label="Close tray">
            <CrossIcon className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </aside>
  )
}
