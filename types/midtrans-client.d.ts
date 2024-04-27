declare module 'midtrans-client' {
  export class Snap {
    constructor(options: SnapOptions)
    createTransaction(data: TransactionData): Promise<TransactionResult>
    // Tambahkan deklarasi tipe lainnya sesuai kebutuhan
  }

  interface SnapOptions {
    isProduction: boolean
    serverKey: string
    clientKey: string
    // Tambahkan properti opsional atau wajib lainnya
  }

  interface TransactionData {
    transaction_details: {
      order_id: string
      gross_amount: number
    }
    customer_details: {
      first_name: string
      email: string
      phone: string
    }
    shipping_address?: {
      first_name: string
      email: string
      phone: string
      address: string
      city: string
      postal_code: string
      country_code?: string
    }
    item_details: {
      id: string
      price: number
      quantity: number
      name: string
    }[]
  }

  interface TransactionResult {
    token: string
    redirect_url: string
    // Tambahkan properti lainnya sesuai respons
  }
}
