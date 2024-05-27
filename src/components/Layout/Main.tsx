import Notification from "../UI/Notification"

type ChildrenProps = {
  children: React.ReactNode
}

export default function Main ({ children }: ChildrenProps) {
  return (
    <main className="w-full my-4 text-gray-900">
      {children}
      <Notification message="" />
    </main>
  )
}
