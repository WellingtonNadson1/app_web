import HeaderLoad from "@/components/HeaderLoad";
import NavProgressBar from "@/components/NavProgressBar";

export default function LoadingSupervisor() {
  // You can add any UI inside Loading, including a Skeleton.
  return <NavProgressBar />;
}

export function LoaderHeaderSupervisor() {
  return <HeaderLoad />;
}
