import React from "react";

const PrivacyPolicyEcommerce = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-700">
      {/* Header */}
      <header className="text-center mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold text-gray-900">Política de Privacidad</h1>
        <p className="mt-2 text-lg text-gray-500">Última actualización: 20 de Octubre de 2023</p>
      </header>

      {/* Introducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introducción</h2>
        <p className="text-gray-600 leading-relaxed">
          Cuando navegas por nuestro sitio web o utilizas nuestros servicios, confías en nosotros con tu información personal. Nos tomamos esta responsabilidad muy en serio y estamos comprometidos a proteger tus datos y brindarte control sobre ellos. Esta Política de Privacidad tiene como objetivo explicar qué información recopilamos, cómo la utilizamos, cómo la protegemos y cómo puedes gestionarla.
        </p>
      </section>

      {/* Información que Recopilamos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Información que Recopilamos</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Datos Proporcionados Directamente</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Nombre, correo electrónico, número de teléfono, dirección postal.</li>
              <li>Nombre de usuario, contraseña (encriptada), preferencias de idioma.</li>
          
              <li>Mensajes enviados a través de formularios de contacto, comentarios en blogs o redes sociales.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Datos Recopilados Automáticamente</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li> páginas visitadas, tiempo de permanencia en el sitio.</li>
              <li>Cómo interactúas con nuestros servicios (por ejemplo, productos vistos, compras realizadas).</li>
       
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Cookies y Tecnologías Similares</h3>
            <p className="text-gray-600">
              Usamos cookies para mejorar tu experiencia y optimizar nuestros servicios. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo. Puedes configurar tu navegador para rechazar cookies, aunque esto podría limitar ciertas funcionalidades del sitio.
            </p>
          </div>
        </div>
      </section>

      {/* ¿Por Qué Recopilamos Tus Datos? */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">¿Por Qué Recopilamos Tus Datos?</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Propósitos Principales</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Procesamiento de pedidos: Para gestionar tus compras, enviar productos y emitir facturas.</li>
              <li>Soporte al cliente: Para responder a tus consultas, resolver problemas y brindarte asistencia.</li>
              <li>Personalización: Para ofrecerte recomendaciones personalizadas basadas en tus intereses y hábitos de compra.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Marketing y Comunicaciones</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Boletines informativos: Para enviarte ofertas, promociones y actualizaciones relevantes (solo con tu consentimiento).</li>
              <li>Encuestas y retroalimentación: Para mejorar nuestros servicios y productos.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Análisis y Mejora</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Análisis estadísticos: Para comprender cómo los usuarios interactúan con nuestro sitio y mejorar su funcionalidad.</li>
              <li>Seguridad: Para detectar actividades fraudulentas y proteger nuestros sistemas.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Compartir Tu Información */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compartir Tu Información</h2>
        <p className="text-gray-600 mb-4">
          No vendemos ni compartimos tu información personal con terceros sin tu consentimiento, excepto en los siguientes casos:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Proveedores de Servicios:</strong> Procesadores de pagos (Stripe, PayPal), servicios logísticos (DHL, FedEx), herramientas analíticas (Google Analytics).</li>
          <li><strong>Requisitos Legales:</strong> Divulgación requerida por ley, regulaciones o autoridades gubernamentales.</li>
          <li><strong>Fusión o Adquisición:</strong> Transferencia de datos en caso de fusión, adquisición o venta de activos.</li>
        </ul>
      </section>

      {/* Tus Derechos Sobre Tus Datos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tus Derechos Sobre Tus Datos</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Acceso y Rectificación:</strong> Solicitar una copia de tus datos personales y corregir cualquier información inexacta.</li>
          <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos personales, excepto cuando sea necesario para cumplir con obligaciones legales o contractuales.</li>
          <li><strong>Oposición y Retirada de Consentimiento:</strong> Oponerte al uso de tus datos para fines de marketing o retirar tu consentimiento en cualquier momento.</li>
          <li><strong>Portabilidad:</strong> Solicitar una copia de tus datos en un formato estructurado y legible.</li>
        </ul>
      </section>

      {/* Seguridad de Tus Datos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Seguridad de Tus Datos</h2>
        <p className="text-gray-600">
          Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tus datos contra accesos no autorizados, pérdidas o alteraciones. Sin embargo, ninguna transmisión de datos por Internet es completamente segura, por lo que no podemos garantizar la seguridad absoluta.
        </p>
      </section>

      {/* Cambios en la Política de Privacidad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cambios en la Política de Privacidad</h2>
        <p className="text-gray-600">
          Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Si realizamos cambios significativos, te notificaremos mediante un aviso en nuestro sitio web o por correo electrónico. Te recomendamos revisar esta política periódicamente.
        </p>
      </section>

      {/* Contacto */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contacto</h2>
        <p className="text-gray-600 mb-4">
          Si tienes preguntas, inquietudes o deseas ejercer tus derechos sobre tus datos, puedes contactarnos a través de los siguientes medios:
        </p>
       

  <a
    href="/contact-us"
    className="text-blue-500 hover:underline font-medium text-lg"
  >
    <b>
    <h1>Contáctanos</h1></b>
  </a>

      </section>

 
    </div>
  );
};

export default PrivacyPolicyEcommerce;