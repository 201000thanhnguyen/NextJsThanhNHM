import Link from "next/link"
import { Banknote, FileText, Package, ReceiptText, Scale, Users } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DebtHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Quản lý nợ"
            description="Ghi nợ, khách hàng, sản phẩm gợi ý và thanh toán — mỗi phần một trang, dễ thao tác trên điện thoại và máy tính."
            icon={<Scale className="h-5 w-5 text-neutral-700" />}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <ReceiptText className="h-5 w-5 text-neutral-600" />
                    Ghi nợ
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Tìm khách hàng, chọn ngày phát sinh, thêm dòng sản phẩm và lưu giao dịch.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-11 min-w-[5.5rem] shrink-0 text-base">
                  <Link href="/log-work/debt/transaction">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <Users className="h-5 w-5 text-neutral-600" />
                    Khách hàng
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">Tìm kiếm, tạo mới và mở chi tiết công nợ.</p>
                </div>
                <Button asChild variant="outline" className="h-11 min-w-[5.5rem] shrink-0 text-base">
                  <Link href="/log-work/debt/customers">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <Package className="h-5 w-5 text-neutral-600" />
                    Sản phẩm
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">Gợi ý tên và giá mặc định — giá giao dịch luôn do bạn nhập.</p>
                </div>
                <Button asChild variant="outline" className="h-11 min-w-[5.5rem] shrink-0 text-base">
                  <Link href="/log-work/debt/products">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <Banknote className="h-5 w-5 text-neutral-600" />
                    Thanh toán
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Ghi tiền khách trả, ngày thanh toán, lịch sử và điều chỉnh khi đổi ý.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-11 min-w-[5.5rem] shrink-0 text-base">
                  <Link href="/log-work/debt/payment">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <FileText className="h-5 w-5 text-neutral-600" />
                    Sao kê
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Xem chi tiết giao dịch theo snapshot và trạng thái thanh toán tại thời điểm ghi nợ.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-11 min-w-[5.5rem] shrink-0 text-base">
                  <Link href="/log-work/debt/report">Open</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
