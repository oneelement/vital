import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom' // <-- Ensure this is imported
import Panels from './Panels'
import { PanelType } from '../../types/panelTypes'

// Mock useLocalStorage hook
jest.mock('../../hooks/useStorage', () => ({
  useLocalStorage: jest.fn().mockReturnValue([[], jest.fn()]), // Ensure the mock returns an array
}))

// Mock child components
jest.mock('./PanelsActions', () => ({
  __esModule: true,
  default: ({ triggerNewPanel }: { triggerNewPanel: () => void }) => (
    <button onClick={triggerNewPanel}>New Panel</button>
  ),
}))

jest.mock('./PanelsEmptyState', () => ({
  __esModule: true,
  default: ({ triggerNewPanel }: { triggerNewPanel: () => void }) => (
    <div>
      <p>No panels available</p>
      <button onClick={triggerNewPanel}>Create a new panel</button>
    </div>
  ),
}))

jest.mock('./PanelsList', () => ({
  __esModule: true,
  default: ({ panels, onEdit }: { panels: PanelType[], onEdit: (panel: PanelType) => void }) => (
    <div>
      {panels.map(panel => (
        <div key={panel.id}>
          <span>{panel.name}</span>
          <button onClick={() => onEdit(panel)}>Edit</button>
        </div>
      ))}
    </div>
  ),
}))

jest.mock('./PanelsTray', () => ({
  __esModule: true,
  default: ({ title, open, onClose, children }: { title: string, open: boolean, onClose: () => void, children: React.ReactNode }) => (
    open ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null
  ),
}))

jest.mock('./Panel', () => ({
  __esModule: true,
  default: ({ onSavePanel }: { onSavePanel: (panel: PanelType) => void }) => {
    const handleSubmit = () => {
      onSavePanel({
        id: '1',
        name: 'New Panel',
        lab: { id: '1', name: 'Lab 1' },
        collectionMethod: { id: '1', name: 'Test kit', value: 'test_kit' },
        biomarkers: [],
      })
    }

    return (
      <div>
        <button onClick={handleSubmit}>Save Panel</button>
      </div>
    )
  },
}))

describe('Panels Component', () => {
  const useLocalStorageMock = jest.requireMock('../../hooks/useStorage').useLocalStorage

  beforeEach(() => {
    useLocalStorageMock.mockReturnValue([[], jest.fn()]) // Reset mock before each test
  })

  it('renders without crashing', () => {
    render(<Panels />)
    expect(screen.getByText('Your Panels')).toBeInTheDocument()
  })

  it('displays empty state when no panels are present', () => {
    render(<Panels />)
    expect(screen.getByText('No panels available')).toBeInTheDocument()
    expect(screen.getByText('Create a new panel')).toBeInTheDocument()
  })

  it('opens panel tray when creating a new panel', () => {
    render(<Panels />)
    fireEvent.click(screen.getByText('Create a new panel'))
    expect(screen.getByText('New panel')).toBeInTheDocument()
  })

  it('saves a new panel', () => {
    const { container } = render(<Panels />)
    fireEvent.click(screen.getByText('Create a new panel'))
    fireEvent.click(screen.getByText('Save Panel'))

    const savedPanel = container.querySelector('.tray-closed')
    expect(savedPanel).toBeInTheDocument()
  })

  it('edits an existing panel', () => {
    useLocalStorageMock.mockImplementationOnce(() => [
      [{
        id: '1',
        name: 'Test Panel',
        lab: { id: '1', name: 'Lab 1' },
        collectionMethod: { id: '1', name: 'Test kit', value: 'test_kit' },
        biomarkers: [],
      }],
      jest.fn()
    ])

    render(<Panels />)
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Edit panel')).toBeInTheDocument()
  })

  it('handles pagination correctly', () => {
    const panelsMock = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Panel ${i + 1}`,
      lab: { id: '1', name: 'Lab 1' },
      collectionMethod: { id: '1', name: 'Test kit', value: 'test_kit' },
      biomarkers: [],
    }))

    useLocalStorageMock.mockImplementation(() => [panelsMock, jest.fn()])

    render(<Panels />)
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.queryByText('Panel 11')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Panel 11')).toBeInTheDocument()
  })
})
