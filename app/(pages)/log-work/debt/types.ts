export type DebtTransactionStatus = "UNPAID" | "PARTIAL" | "PAID"

export type DebtCustomer = {
  id: string
  name: string
  phone: string | null
  note: string | null
  createdAt: string
}

export type DebtProduct = {
  id: string
  name: string
  defaultPrice: string
  isActive: boolean
  createdAt: string
}

export type DebtTransactionItem = {
  id: string
  transactionId: string
  productId: string | null
  productNameSnapshot: string
  priceSnapshot: string
  originalProductPrice: string | null
  quantity: number
  subtotal: string
}

export type DebtTransaction = {
  id: string
  customerId: string
  customerNameSnapshot: string
  totalAmount: string
  paidAmount: string
  status: DebtTransactionStatus
  note: string | null
  createdAt: string
  transactionDate: string | null
}

export type DebtTransactionDetail = DebtTransaction & {
  items: DebtTransactionItem[]
}

export type DebtPaymentAllocation = {
  id: string
  paymentId: string
  transactionId: string
  amount: string
  createdAt?: string
}

export type DebtPaymentAdjustment = {
  id: string
  paymentId: string
  amountAdjustment: string
  note: string | null
  createdAt: string
}

export type DebtPayment = {
  id: string
  customerId: string
  customerNameSnapshot: string
  amount: string
  note: string | null
  createdAt: string
  paymentDate: string | null
}

export type DebtPaymentListRow = DebtPayment & {
  actualAmount: string
  adjustments: DebtPaymentAdjustment[]
}

export type DebtPaymentDetail = DebtPayment & {
  allocations: DebtPaymentAllocation[]
  adjustments?: DebtPaymentAdjustment[]
  actualAmount?: string
}

export type CustomerDebtRow = {
  customerId: string
  customerNameSnapshot: string
  debt: string
}

export type TimelineEntry =
  | {
      kind: "transaction"
      id: string
      transactionDate: string
      createdAt: string
      totalAmount: string
      paidAmount: string
      status: string
      note: string | null
      runningDebt: string
    }
  | {
      kind: "payment"
      id: string
      paymentDate: string
      createdAt: string
      amount: string
      actualAmount: string
      note: string | null
      runningDebt: string
    }
