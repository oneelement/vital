import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SelectMenu from './SelectMenu'
import { Option } from './SelectMenu'

describe('SelectMenu', () => {
  const options: Option[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ]

  const label = 'Test Label'
  const name = 'test-select-menu'

  it('should render without crashing', () => {
    render(<SelectMenu label={label} name={name} options={options} onSelect={jest.fn()} />)
  })

  it('should display the label', () => {
    render(<SelectMenu label={label} name={name} options={options} onSelect={jest.fn()} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should open the menu when clicked', () => {
    render(<SelectMenu label={label} name={name} options={options} onSelect={jest.fn()} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    options.forEach(option => {
      expect(screen.getByText(option.name)).toBeInTheDocument()
    })
  })

  it('should call onSelect with the correct option when an option is clicked', () => {
    const handleSelect = jest.fn()
    render(<SelectMenu label={label} name={name} options={options} onSelect={handleSelect} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const optionElement = screen.getByText('Option 1').closest('li')
    if (optionElement) {
      fireEvent.click(optionElement)
    }
    expect(handleSelect).toHaveBeenCalledWith(options[0])
  })

  it('should close the menu when an option is clicked', () => {
    render(<SelectMenu label={label} name={name} options={options} onSelect={jest.fn()} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const optionElement = screen.getByText('Option 1').closest('li')
    if (optionElement) {
      fireEvent.click(optionElement)
    }
    // Checking if the dropdown list is hidden
    expect(screen.queryByRole('listbox')).toHaveClass('hidden')
  })

  it('should close the menu when clicking outside', () => {
    render(
      <>
        <SelectMenu label={label} name={name} options={options} onSelect={jest.fn()} />
        <div data-testid="outside">Outside Element</div>
      </>
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.mouseDown(screen.getByTestId('outside'))
    // Checking if the dropdown list is hidden
    expect(screen.queryByRole('listbox')).toHaveClass('hidden')
  })

  it('should update the selected option when props change', () => {
    const { rerender } = render(
      <SelectMenu label={label} name={name} options={options} selected={options[0]} onSelect={jest.fn()} />
    )
    expect(screen.getByRole('button')).toHaveTextContent('Option 1')
    rerender(<SelectMenu label={label} name={name} options={options} selected={options[1]} onSelect={jest.fn()} />)
    expect(screen.getByRole('button')).toHaveTextContent('Option 2')
  })
})
