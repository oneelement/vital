import { useState } from "react"
import { useLocalStorage } from "../../hooks/useStorage"
import PanelsActions from "./PanelsActions"
import PanelsEmptyState from "./PanelsEmptyState"
import PanelsTray from "./PanelsTray"
import Panel from "./Panel"
import PanelsList from "./PanelsList"
import { PanelType } from "../../types/panelTypes"
import Pagination from "../../components/UI/Pagination"

const createNewPanel = (): PanelType => ({
  id: '',
  name: '',
  lab: { id: '', name: '' },
  collectionMethod: { id: '', name: '', value: '' },
  biomarkers: [],
})

export default function Panels() {
  const [ page, setPage ] = useState(1)
  const perPage = 10
  const [ panels, setPanels ] = useLocalStorage<PanelType[]>('panels', []) 
  const [isPanelsTrayOpen, setIsPanelsTrayOpen] = useState(false)
  
  const [ trayTitle, setTrayTitle ] = useState('New panel')
  const [ currentPanel, setCurrentPanel ] = useState<PanelType>(createNewPanel)

  const onTriggerNewPanel = () => {
    setCurrentPanel(createNewPanel)
    setIsPanelsTrayOpen(true)
  }

  const onClosePanelsTray = () => {    
    setIsPanelsTrayOpen(false)
    setTimeout(() => {
      // match animation delay to reset the form
      setCurrentPanel(createNewPanel)
    }, 700)
  }

  const savePanel = (panel: PanelType) => {
    if (panel.id) {
      setPanels((prev: PanelType[]) => {
        return prev.map((p) => p.id === panel.id ? panel : p)
      })
    } else {
      panel.id = Math.random().toString(36).substring(2, 9)
      setPanels((prev: PanelType[]) => [...prev, panel])
    }
    
    setIsPanelsTrayOpen(false)
  }

  const handleEdit = (panel: PanelType) => {
    setTrayTitle('Edit panel')
    setIsPanelsTrayOpen(true)
    setCurrentPanel(panel)
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const nextPage = () => {
    if (page < Math.ceil(panels.length / perPage)) {
      setPage(page + 1)
    }
  }

  const paginatedPanels = panels.slice((page - 1) * perPage, page * perPage)

  return (
    <div className={`${isPanelsTrayOpen ? 'xl:mr-[384px] tray-open' : 'tray-closed'} transition-margin duration-700 ease-in-out`}>
      <div className="mx-auto max-w-7xl p-4">      
        <h1 className='text-2xl font-semibold mb-4'>Your Panels</h1>
        <p className="text-sm mb-4 sm:mb-2 text-gray-700">A list of all the lab tests available for ordering to your team.</p>
        <PanelsActions triggerNewPanel={onTriggerNewPanel} />
        <div>
          {panels.length === 0 ? (
            <PanelsEmptyState triggerNewPanel={onTriggerNewPanel} />
          ) : (
            <PanelsList panels={paginatedPanels} onEdit={handleEdit} />
          )}
        </div>
        {panels.length > perPage && (
          <Pagination totalResults={panels.length} page={page} perPage={perPage} prevPage={prevPage} nextPage={nextPage} />
        )}
      </div>
      <PanelsTray title={trayTitle} open={isPanelsTrayOpen} onClose={onClosePanelsTray}>
        <Panel onSavePanel={savePanel} currentPanel={currentPanel} />
      </PanelsTray>
    </div>

  )
}