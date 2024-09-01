"use client";
import Calendar from "@/components/Calendar/Calendar";
// import ControlePresenca from '@/components/ControlePresenca'
import LicoesCelula from "@/components/LicoesCelula";

export default function ControleCelula() {
  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        <Calendar />
      </div>
      <div className="relative w-full px-2 mx-auto mb-4">
        <LicoesCelula />
      </div>
      {/* <div className="relative w-full px-2 mx-auto mb-4">
        <ControlePresenca />
      </div> */}
    </div>
  );
}
