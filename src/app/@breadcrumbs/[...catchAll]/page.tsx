"use client"
import { usePathname } from "next/navigation"
import { Breadcrumbs } from "../breadcrumbspage"

type Props = {
  params: {
    catchAll: string[]
  }
}
export default function BreadcrumbsSlot() {
  const paths = usePathname()
  const pathNames = paths.split('/').filter(path => path)
  return (
    <div className="ml-3">
      <Breadcrumbs routes={pathNames} />
    </div>
  )
}
