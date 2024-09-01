import HeaderLoad from "@/components/HeaderLoad";
import NavProgressBar from "@/components/NavProgressBar";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <NavProgressBar />;
}

export function LoaderHeader() {
  return <HeaderLoad />;
}
