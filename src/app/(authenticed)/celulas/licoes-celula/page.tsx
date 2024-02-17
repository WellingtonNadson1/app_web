import AddNewTemaLicoesCelula from "./AddNewTemaLicoesCelula"

export default function LicoesCelula() {
  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
        <div className="w-full px-2 py-2 bg-white shadow-lg rounded-xl ">
          <div className="flex items-center justify-between w-full gap-3 px-1 py-2 rounded-md sm:justify-start">
            <div className="w-full px-4 py-2 rounded-lg shadow-md card bg-base-100">
              <h2 className="text-sm font-bold text-gray-500">Lições de Células</h2>
              <div className="mt-2 card-body">
                <AddNewTemaLicoesCelula />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
