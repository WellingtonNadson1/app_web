import React, { ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { HouseLine } from "@phosphor-icons/react/dist/ssr";

export function Breadcrumbs({ routes = [] }: { routes: string[] }) {
  let fullHref: string | undefined = undefined;
  const breadcrumbItems: ReactElement[] = [];
  let breadcrumbPage: ReactElement = (<></>);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    let href;

    href = fullHref ? `${fullHref}/${route}` : `/${route}`
    fullHref = href

    if (i === routes.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage>{route}</BreadcrumbPage>
        </BreadcrumbItem>
      )
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbSeparator className="text-gray-200" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-200 py-2 flex items-center gap-1" href={href}>{route}</BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      )
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-gray-200 py-2 flex items-center gap-1" href="/">
            <HouseLine size={23} />
            Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
        <BreadcrumbSeparator className="text-gray-200" />
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
