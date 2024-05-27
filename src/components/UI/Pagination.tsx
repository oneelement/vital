import Button from './Button'

type PaginationProps ={
  totalResults: number
  page: number
  perPage: number,
  nextPage: () => void
  prevPage: () => void
}

export default function Pagination({ totalResults, page = 1, perPage = 1, nextPage, prevPage }: PaginationProps) {
  const onPrevious = () => {
    if (page > 1) {
      prevPage()
    }
  }
  const onNext = () => {
    if (page * perPage < totalResults) {
      nextPage()
    }
  }

  const startResult = (page - 1) * perPage + 1
  const endResult = Math.min(page * perPage, totalResults)

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white pt-4 mt-2" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          {`Showing ${startResult} to ${endResult} of ${totalResults} results`}
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onPrevious} disabled={page === 1}>Previous</Button>
        <Button variant="secondary" onClick={onNext} disabled={totalResults === endResult}>Next</Button>
      </div>
    </nav>
  )
}
