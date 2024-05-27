type ButtonProps = {
  disabled?: boolean,
  children: React.ReactNode,
  className?: string,
  variant?: 'primary' | 'secondary',
  onClick: () => void
}

export default function Button({ disabled = false, children, variant = 'primary', className, onClick }: ButtonProps) {
  const baseStyles = 'font-base py-2 px-4 rounded-lg text-sm'
  const buttonStyles = variant === 'primary' ? `bg-vital-green ${!disabled ? 'hover:bg-vital-green-hover' : ''} text-white` : `bg-gray-200 text-gray-900`
  const diabledStyles = disabled ? 'cursor-not-allowed opacity-40' : ''
  return (
    <button onClick={onClick} className={`${className} ${baseStyles} ${buttonStyles} ${diabledStyles}`}>
      {children}
    </button>
  )
}