import { useState, useEffect, useRef } from 'react'

export type Option = {
  id: string,
  name: string,
  value?: string
}

type SelectMenuProps = {
  label: string,
  name: string,
  error?: string | null,
  options: Option[],
  selected?: Option,
  onSelect: (option: Option) => void
}

export default function SelectMenu({ label, name, options, selected, onSelect, error }: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(selected || null)
  const selectMenuRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const selectOption = (option: Option) => {
    if (option.id !== selectedOption?.id) {
      setSelectedOption(option)
      onSelect(option)
    }    
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    setSelectedOption(selected || null)
  }, [selected])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={selectMenuRef}>
      <label id={name} className="text-sm font-base">{label}</label>
      <div className="relative mt-2">
        <button onClick={toggleOpen} type="button" className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
          <span className="block truncate">
            {selectedOption && selectedOption.name ? selectedOption.name : <span className="text-gray-400">Select {name}</span>}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
        <ul 
          className={`${isOpen ? '' : 'hidden'} absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`} 
          role="listbox" 
          aria-labelledby={name}
        >
          {options && options.sort((a, b) => a.name.localeCompare(b.name) ).map((option, index) => (
            <li
              onClick={() => selectOption(option)} 
              key={option.id} 
              className={`${selectedOption && selectedOption.id === option.id ? 'bg-gray-100' : ''} relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100`}
              id={`listbox-option-${index}`} 
              role="option" 
              aria-selected={!!(selectedOption && selectedOption.id === option.id)}
            >
              <span className="font-normal block truncate">{option.name}</span>
            </li>
          ))}
          {options.length === 0 && (
            <li className="py-2 pl-3 pr-9 text-gray-400">{`${error ? error : 'No options available'}`}</li>
          )}
        </ul>
      </div>
    </div>
  )
}


