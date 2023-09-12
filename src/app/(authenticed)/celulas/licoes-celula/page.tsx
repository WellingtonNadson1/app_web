import AddNewLicoesCelula from "./AddNewLicoesCelula"

export default function LicoesCelula() {
  return (
    <>
      <div className="relative mx-auto w-full mt-4 px-4 py-2 ">
        <div className="w-full shadow-lg rounded-xl bg-white px-2 py-2 ">
          <div className="flex items center justify-between sm:justify-start gap-3 w-full rounded-md px-1 py-2">
            <div className="card rounded-lg w-full bg-base-100 shadow-md px-4 py-2">
              <h2>Lições de Células</h2>
              <div className="card-body mt-2">
                <h2 className="card-title">Shoes!</h2>
                  <AddNewLicoesCelula />
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}