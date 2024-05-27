import { PanelType } from "../../types/panelTypes"

type PanelsListProps = {
  panels: PanelType[]
  onEdit: (panel: PanelType) => void
}

export default function PanelsList({ panels, onEdit }: PanelsListProps) {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr className="text-sm font-semibold text-left">
            <th scope="col" className="px-3 py-2 pl-0">Name</th>
            <th scope="col" className="px-3 py-2">Lab</th>
            <th scope="col" className="px-3 py-2">Biomarkers</th>
            <th scope="col" className="px-3 py-2">Collection method</th>
            <th scope="col" className="relative py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
          {panels.map((panel) => (
            <tr key={panel.name}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">{panel.name}</td>
              <td className="whitespace-nowrap px-3 py-4">{panel.lab.name}</td>
              <td className="whitespace-nowrap px-3 py-4">
                <ul className="flex flex-wrap gap-1">
                  {panel.biomarkers.map((biomarker) => (
                    <li key={biomarker.id} className="bg-vital-green text-white rounded-md px-2 py-1 flex items-center justify-center">
                      <span className="text-xs truncate max-w-32">{biomarker.name}</span>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="whitespace-nowrap px-3 py-4">{panel.collectionMethod.name}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
                <span onClick={() => onEdit(panel)} className="text-vital-green cursor-pointer">Edit</span>
              </td>
            </tr>
          ))}         
        </tbody>
      </table>
    </div>
  )
}