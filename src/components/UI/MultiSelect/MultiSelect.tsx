import { useState, useEffect, useRef } from 'react'
import TickIcon from '../Icons/TickIcon'
import Tag from '../Tag'

export type Option = {
  id: string,
  name: string,
  value?: string
}

type MultiSelectProps = {
  label: string,
  name: string,
  error?: string | null,
  noResultsText?: string,
  selected?: Option[],
  options: Option[],
  onSelect: (option: Option[]) => void
}

export default function MultiSelect({ label, name, noResultsText = 'No options available', selected, options, onSelect, error }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(selected || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const selectMenuRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const selectOption = (option: Option) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o: Option) => o.id === option.id)
      const newSelectedOptions = exists 
        ? prev.filter((o: Option) => o.id !== option.id) 
        : [...prev, option]
      return newSelectedOptions  
    })
  }

  useEffect(() => {
    setSelectedOptions(selected || [])
  }, [selected])

  useEffect(() => {
    onSelect(selectedOptions)
  }, [selectedOptions, onSelect])

  const handleClickOutside = (event: MouseEvent) => {
    if (selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const removeOption = (name: string) => {
    setSelectedOptions((prev) => prev.filter((o: Option) => o.name !== name))  
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    setFilteredOptions(options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [searchTerm, options])

  return (  
    <div>
      <label htmlFor="combobox" className="text-sm mb-2">{label}</label>
      <div ref={selectMenuRef} className="relative">
        <div onClick={toggleOpen} className="relative">
          <input 
            id="combobox"
            value={searchTerm}
            placeholder={`Select ${name}`}
            onChange={onChangeInput}
            type="text" 
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 outline-none sm:text-sm" 
            role="combobox" 
            aria-controls="options" 
            aria-expanded={isOpen}
          />
          <button type="button" className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <ul 
          className={`${isOpen ? '' : 'hidden'} absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`} 
          id="options" 
          role="listbox"
        >
          {filteredOptions && filteredOptions.sort((a, b) => a.name.localeCompare(b.name) ).map((option, index) => (
            <li
              onClick={() => selectOption(option)} 
              key={option.id} 
              className={`${selectedOptions.some((o: Option) => o.id === option.id) ? 'bg-gray-100' : ''} relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100`}
              id={`listbox-option-${index}`} 
              role="option" 
              aria-selected={selectedOptions.some((o: Option) => o.id === option.id)}
            >
              <span className="font-normal block truncate">{option.name}</span>
              {selectedOptions.some((o: Option) => o.id === option.id) &&
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-vital-green">
                  <TickIcon className="h-5 w-5" />
                </span>
              }
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className="py-2 pl-3 pr-9 text-gray-400">{`${error ? error : noResultsText}`}</li>
          )}
        </ul>
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Tag key={option.id} name={option.name} onRemove={removeOption} />
          ))}
        </div>
      </div>
    </div>
  )
}