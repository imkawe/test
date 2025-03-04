export default function CheckoutSuccess() {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">
            ✅ Pago Completado Exitosamente
          </h1>
          <p className="text-green-700">
            Tu transacción se ha procesado correctamente
          </p>
        </div>
      </div>
    );
  }