import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Título Principal */}
      <div className="bg-white py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Política de Envíos
        </h1>
      </div>

      {/* Contenedor Principal - Full Width */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Sección 1: Tiempo de procesamiento del pedido */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-green-600">📦</span>
              ACABO DE HACER UN PEDIDO, ¿CUÁNDO SE ENVIARÁ?
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              Por favor, permite un tiempo de procesamiento y producción de{' '}
              <strong className="text-gray-800">1 a 3 días hábiles</strong> para que tu pedido sea enviado.
            </p>
          </div>

          {/* Sección 2: Tiempo de envío */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-blue-600">🚚</span>
              ¿CUÁNTO TIEMPO TARDA EL ENVÍO?
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              • Tiempo promedio: <strong className="text-gray-800">2 a 5 días hábiles</strong>
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Existen circunstancias fuera de nuestro control (desastres naturales, festivos, clima, etc.) que pueden causar retrasos en los envíos. Aunque la mayoría de los paquetes llegan a tiempo, pueden presentarse situaciones que retrasen el servicio de las compañías de transporte. Por esta razón, no garantizamos el tiempo exacto de entrega; el tema de la entrega es responsabilidad de la compañía de envíos.
            </p>
          </div>

          {/* Sección 3: Cancelación del pedido */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-red-600">❌</span>
              ¿PUEDO CANCELAR MI PEDIDO?
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              ¡Puedes cancelar tu pedido sin penalización! Debes cancelarlo dentro de las{' '}
              <strong className="text-gray-800">24 horas</strong> posteriores a su creación para que la cancelación sea aplicada. Si el artículo ya ha sido enviado, solo necesitas enviarnos un correo electrónico con el asunto{' '}
              <strong className="text-gray-800">"CANCELAR"</strong>.
            </p>
          </div>

          {/* Sección 4: Dirección incorrecta */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-yellow-600">📍</span>
              ¡INGRESÉ UNA DIRECCIÓN INCORRECTA!
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              Si has escrito mal o el autocompletado ha ingresado una dirección incorrecta, simplemente responde al correo de confirmación de tu pedido y proporciónanos la información correcta. Notifícanos de inmediato por correo electrónico. Si la dirección es incorrecta, podemos corregirla dentro de las{' '}
              <strong className="text-gray-800">24 horas</strong>.
            </p>
          </div>

          {/* Sección 5: Artículos dañados */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-orange-600">⚠️</span>
              MI ARTÍCULO LLEGÓ DAÑADO
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              Enviamos cada artículo con protección adicional. A pesar de esto, nuestros clientes reportan que aproximadamente{' '}
              <strong className="text-gray-800">1 de cada 1000</strong> productos llega dañado debido al maltrato del servicio postal.
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Si esto te sucede, por favor contáctanos con:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
              <li>Tu número de pedido.</li>
              <li>Una foto del producto dañado.</li>
            </ul>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Una vez recibido, estaremos encantados de enviarte un reemplazo sin costo adicional.
            </p>
          </div>

          {/* Sección 6: Preguntas no respondidas */}
          <div className="bg-white shadow-sm rounded-lg p-8">
            <h2 className="flex items-center text-2xl font-semibold text-gray-700">
              <span className="mr-3 text-purple-600">❓</span>
              TENGO UNA PREGUNTA QUE NO FUE RESPONDIDA, ¿PUEDEN AYUDARME?
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4">
              Si aún no hemos logrado responder tu pregunta, no dudes en contactarnos, y haremos todo lo posible por responderte dentro de las{' '}
              <strong className="text-gray-800">24 horas</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;