import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-700">Cham cong</h1>

      <div className="grid gap-3">
        <Link
          href="/log-work/checkin/shifts"
          className="bg-white p-4 rounded-xl shadow text-gray-600 font-medium"
        >
          Ca lam
        </Link>

        <Link
          href="/log-work/checkin/attendance"
          className="bg-white p-4 rounded-xl shadow text-gray-600 font-medium"
        >
          Danh sach ngay cham cong
        </Link>

        <Link
          href="/log-work/checkin/bonus"
          className="bg-white p-4 rounded-xl shadow text-gray-600 font-medium"
        >
          Thuong / phu cap
        </Link>
      </div>
    </div>
  )
}
