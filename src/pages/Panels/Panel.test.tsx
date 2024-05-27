import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import Panel from './Panel'
import { PanelType, OptionType } from '../../types/panelTypes'
import useFetch from '../../hooks/useFetch'

// Mock useFetch hook
jest.mock('../../hooks/useFetch')

// Mock components
jest.mock('../../components/UI/Button', () => ({ children, ...props }: { children: React.ReactNode, [key: string]: unknown }) => (
  <button {...props}>{children}</button>
))
jest.mock('../../components/UI/SelectMenu/SelectMenu', () => ({ label, name, onSelect, options, selected }: { label: string, name: string, onSelect: (selected: OptionType) => void, options: OptionType[], selected: OptionType }) => (
  <div data-testid={`select-menu-${name}`}>
    <label>{label}</label>
    <select data-testid={name} onChange={(e) => {
      const selectedOption = options.find(opt => opt.id === e.target.value)
      if (selectedOption) {
        onSelect(selectedOption)
      }
    }} value={selected ? selected.id : ''}>
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
))
jest.mock('../../components/UI/MultiSelect/MultiSelect', () => ({ label, name, onSelect, options, selected }: { label: string, name: string, onSelect: (selected: OptionType[]) => void, options: OptionType[], selected: OptionType[] }) => (
  <div data-testid={`multiselect-${name}`}>
    <label>{label}</label>
    <div data-testid={name}>
      {options.map(opt => (
        <div key={opt.id}>
          <input
            type="checkbox"
            value={opt.id}
            checked={selected.some((sel: OptionType) => sel.id === opt.id)}
            onChange={() => {
              if (selected.some((sel: OptionType) => sel.id === opt.id)) {
                onSelect(selected.filter((sel: OptionType) => sel.id !== opt.id))
              } else {
                onSelect([...selected, opt])
              }
            }}
          />
          {opt.name}
        </div>
      ))}
    </div>
  </div>
))

const mockLabs = [
  { id: '1', name: 'Lab 1' },
  { id: '2', name: 'Lab 2' }
]

const mockMarkers = [
  { id: '1', name: 'Marker 1' },
  { id: '2', name: 'Marker 2' }
]

const mockPanel: PanelType = {
  id: '1',
  name: 'Test Panel',
  lab: { id: '', name: '' },
  collectionMethod: { id: '', name: '', value: '' },
  biomarkers: []
}

describe('Panel', () => {
  it('renders without crashing', () => {
    (useFetch as jest.Mock).mockReturnValue({ data: mockLabs })
    render(<Panel onSavePanel={jest.fn()} currentPanel={mockPanel} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('displays the labs in the select menu', async () => {
    (useFetch as jest.Mock).mockReturnValueOnce({ data: mockLabs })
    render(<Panel onSavePanel={jest.fn()} currentPanel={mockPanel} />)
    fireEvent.click(screen.getByTestId('lab'))
    await waitFor(() => {
      const selectMenu = within(screen.getByTestId('select-menu-lab'))
      mockLabs.forEach(lab => {
        expect(selectMenu.getByRole('option', { name: lab.name })).toBeInTheDocument()
      })
    })
  })

  it('displays markers after selecting a lab', async () => {
    (useFetch as jest.Mock).mockReturnValue({ data: mockLabs }).mockReturnValue({ data: mockMarkers })
    render(<Panel onSavePanel={jest.fn()} currentPanel={mockPanel} />)
    fireEvent.change(screen.getByTestId('lab'), { target: { value: '1' } })

    await waitFor(() => {
      const multiSelect = within(screen.getByTestId('multiselect-markers'))
      mockMarkers.forEach(marker => {
        expect(multiSelect.getByText(marker.name)).toBeInTheDocument()
      })
    })
  })

  it('updates the panel name when input changes', () => {
    render(<Panel onSavePanel={jest.fn()} currentPanel={mockPanel} />)
    const input = screen.getByPlaceholderText('Enter panel name')
    fireEvent.change(input, { target: { value: 'Updated Panel Name' } })
    expect(input).toHaveValue('Updated Panel Name')
  })

  it('calls onSavePanel with correct data when save button is clicked', () => {
    const handleSavePanel = jest.fn()
    render(<Panel onSavePanel={handleSavePanel} currentPanel={mockPanel} />)
    const input = screen.getByPlaceholderText('Enter panel name')
    fireEvent.change(input, { target: { value: 'Updated Panel Name' } })
    fireEvent.change(screen.getByTestId('lab'), { target: { value: '1' } })
    fireEvent.click(screen.getByText('Save panel'))
    waitFor(() => {
      expect(handleSavePanel).toHaveBeenCalledWith({
        ...mockPanel,
        name: 'Updated Panel Name',
        lab: mockLabs[0]
      })
    })
  })

  it('disables save button if form is invalid', () => {
    render(<Panel onSavePanel={jest.fn()} currentPanel={mockPanel} />)
    expect(screen.getByText('Save panel')).toBeDisabled()
  })
})
