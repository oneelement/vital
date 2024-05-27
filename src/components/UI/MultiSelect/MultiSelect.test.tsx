import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MultiSelect from './MultiSelect'
import { Option } from './MultiSelect'

describe('MultiSelect', () => {
  const options: Option[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ]

  const label = 'Test Label'
  const name = 'test-multi-select'

  it('should render without crashing', () => {
    render(<MultiSelect label={label} name={name} options={options} onSelect={jest.fn()} />)
  })

  it('should display the label', () => {
    render(<MultiSelect label={label} name={name} options={options} onSelect={jest.fn()} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should open the menu when clicked', () => {
    render(<MultiSelect label={label} name={name} options={options} onSelect={jest.fn()} />)
    const input = screen.getByRole('combobox')
    fireEvent.click(input)
    options.forEach(option => {
      expect(screen.getByText(option.name)).toBeInTheDocument()
    })
  })

  it('should call onSelect with the correct options when an option is clicked', () => {
    const handleSelect = jest.fn()
    render(<MultiSelect label={label} name={name} options={options} onSelect={handleSelect} />)
    const input = screen.getByRole('combobox')
    fireEvent.click(input)
    const optionElement = screen.getByText('Option 1').closest('li')
    if (optionElement) {
      fireEvent.click(optionElement)
    }
    expect(handleSelect).toHaveBeenCalledWith([options[0]])
  })

  it('should close the menu when clicking outside', () => {
    render(
      <>
        <MultiSelect label={label} name={name} options={options} onSelect={jest.fn()} />
        <div data-testid="outside">Outside Element</div>
      </>
    )
    const input = screen.getByRole('combobox')
    fireEvent.click(input)
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.getByRole('listbox')).toHaveClass('hidden')
  })

  it('should update the selected options when props change', () => {
    const { rerender } = render(
      <MultiSelect label={label} name={name} options={options} selected={[options[0]]} onSelect={jest.fn()} />
    )
    expect(screen.getByRole('tag')).toHaveTextContent('Option 1')
    rerender(<MultiSelect label={label} name={name} options={options} selected={[options[1]]} onSelect={jest.fn()} />)
    expect(screen.getByRole('tag')).toHaveTextContent('Option 2')
  })

  it('should filter options based on the search term', () => {
    render(<MultiSelect label={label} name={name} options={options} onSelect={jest.fn()} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Option 2' } })
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })

  it('should display no results text when no options match the search term', () => {
    render(<MultiSelect label={label} name={name} options={options} noResultsText="No matches" onSelect={jest.fn()} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Non-existing option' } })
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })
})
