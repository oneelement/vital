import Button from '../../components/UI/Button'
import PlusIcon from '../../components/UI/Icons/PlusIcon'

type PanelsActionsProps = {
  triggerNewPanel: () => void
}

export default function PanelsActions({ triggerNewPanel }: PanelsActionsProps) {

  const handleClick = () => {
    triggerNewPanel()
  }

  return (
    <div className="flex justify-end">
      <Button onClick={handleClick} className="flex items-center w-full sm:w-auto justify-center">
        Create panel <PlusIcon className="h-3 w-3 ml-2" />
      </Button>
    </div>
  )
}