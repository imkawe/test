export default function CheckoutCancel() {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">
            ❌ Pago Cancelado
          </h1>
          <p className="text-red-700">
            La transacción no se completó correctamente
          </p>
        </div>
      </div>
    );
  }