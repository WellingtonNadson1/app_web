export default function SpinnerButton() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="spinner">
          <div className="flex h-screen items-center justify-center">
            <div className="spinner h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
          </div>
        </div>
      </div>
    </>
  )
}
