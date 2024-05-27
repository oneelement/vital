import CrossIcon from "./Icons/CrossIcon"

type TagProps = {
  key: string,
  name: string,
  onRemove: (name: string) => void
}

export default function Tag({ name, onRemove }: TagProps) {
  return (
    <div className="bg-vital-green text-white rounded-md px-2 py-1 flex items-center justify-center" role="tag">
      <span className="text-xs truncate max-w-32">{name}</span>
      <button onClick={() => onRemove(name)} className="ml-1" type="button">
        <CrossIcon className="h-2 w-2" />
      </button>
    </div>
  )
}