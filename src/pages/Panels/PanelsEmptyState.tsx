import PanelsIcon from '../../components/UI/Icons/PanelsIcon'
import PlusIcon from '../../components/UI/Icons/PlusIcon'

type PanelsEmptyStateProps = {
  triggerNewPanel: () => void
}

export default function PanelsEmptyState( { triggerNewPanel }: PanelsEmptyStateProps) {
  const handleClick = () => {
    triggerNewPanel()
  }
  return (
    <div className="my-8 w-full">
      <button type="button" onClick={handleClick} className="w-full rounded-lg border-2 border-dashed border-gray-300 py-24 px-12 flex flex-col items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-vital-green focus:ring-offset-2">
        <PanelsIcon className="h-8 w-8 mb-2" />
        <p className="text-sm font-semibold text-gray-900 mb-2">No panels yet</p>
        <div className="bg-vital-green hover:bg-vital-green-hover rounded-md px-3 py-2 mt-2 text-sm font-base text-white flex items-center">
          Create a new panel <PlusIcon className="h-3 w-3 ml-2" />
        </div>
      </button>
    </div>
  )
}