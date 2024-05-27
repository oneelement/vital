import { useState, useRef, useCallback, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import Button from '../../components/UI/Button'
import SelectMenu from '../../components/UI/SelectMenu/SelectMenu'
import MultiSelect from '../../components/UI/MultiSelect/MultiSelect'
import { PanelType, BiomarkerType, LabType, CollectionMethodType } from '../../types/panelTypes'

const collectionMethods: CollectionMethodType[] = [
  {
    id: '1',
    name: 'Test kit',
    value: 'test_kit'
  },
  {
    id: '2',
    name: 'At home phlebotomy',
    value: 'at_home_phlebotomy'
  }
]

type PanelProps = {
  onSavePanel: (panel: PanelType) => void,
  currentPanel: PanelType
}

export default function Panel ({ onSavePanel, currentPanel }: PanelProps) {
  const [ panel, setPanel ] = useState<PanelType>(currentPanel)
  
  useEffect(() => {
    setPanel(currentPanel)
  }, [currentPanel])

  const { data: labs, error: labError } = useFetch<LabType[]>('/v3/lab_tests/labs')
  const { data: markers, error: markerError } = useFetch<BiomarkerType[]>(panel.lab.id ? `/v3/lab_tests/markers?lab_id=${panel.lab.id}` : null, 'markers', true)

  const formValid = panel.name && panel.lab.id && panel.collectionMethod && panel.biomarkers.length > 0

  const handleSavePanel = () => {
    if (!formValid) return
    onSavePanel(panel)
  }

  const timeoutRef = useRef<number | null>(null)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setPanel((prev) => ({ ...prev, [name]: value }) )
    }, 500)
  }

  const handleSelectBiomarkers = useCallback((selectedMarkers: BiomarkerType[]) => {
    setPanel((prev) => ({ ...prev, biomarkers: selectedMarkers }))
  }, [])

  return (
    <div className="p-4">
      <div>
        <div className="mb-4">
        <label htmlFor="name" className="block text-sm">Name</label>
          <div className="mt-2">
            <input 
              type="text" 
              name="name" 
              id="panel-name" 
              placeholder='Enter panel name'
              defaultValue={currentPanel.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 px-3 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm outline-none " />
          </div>
        </div>
        <div className="mb-4">
          <SelectMenu 
            label="Lab" 
            name="lab"
            error={labError}
            selected={ panel.lab }
            options={labs || []}
            onSelect={(lab) => setPanel((prev) => ({ ...prev, biomarkers: [], lab}) )} 
          />
        </div>
        <div className="mb-4">
          <MultiSelect 
            label="Biomarkers" 
            name="markers"
            error={markerError}
            noResultsText={markers ? 'No markers found' : 'Select a lab to see markers'}
            selected={panel.biomarkers}
            options={markers ? markers.map(m => ({ name: m.name, value: m.name, id: m.id })) : []} 
            onSelect={handleSelectBiomarkers}
          />
        </div>
        <div className="mb-4">
          <SelectMenu 
            label="Collection method" 
            name="method"
            selected={panel.collectionMethod}
            options={collectionMethods || []} 
            onSelect={(collectionMethod) => setPanel((prev) => ({
              ...prev,
              collectionMethod: {
                ...collectionMethod,
                value: collectionMethod.value || ''
              }
            }))}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSavePanel} disabled={!formValid}>Save panel</Button>
        </div>
      </div>
    </div>
  )
}