import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: sessionStorage.getItem('name') || '', // Recuperar nombre del sessionStorage
    email: sessionStorage.getItem('email') || '', // Recuperar email del sessionStorage
    message: ''
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Guardar name y email en sessionStorage
    if (name === 'name' || name === 'email') {
      sessionStorage.setItem(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '04275135-2349-4412-8207-10a51c87133b', // Regístrate en web3forms.com para obtenerlo
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'Nuevo mensaje del formulario de contacto'
        })
      });

      const data = await response.json();
      if (data.success) {
        setState('success');
        setFormData({ name: '', email: '', message: '' }); // Limpiar el formulario
      } else {
        setError(data.message);
        setState('error');
      }
    } catch (err) {
      setError('Error de conexión');
      setState('error');
    }
  };

  return (
    <div className="max-w-md mx-auto h-full p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Contáctanos</h2>

      {/* Mensaje de Éxito */}
      {state === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-center">
      ✅ ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo en un máximo de 4 horas. ⏳📩
        </div>
      )}

      {/* Mensaje de Error */}
      {state === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center">
          ❌ {error || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Nombre */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo de Correo Electrónico */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo de Mensaje */}
        <div>
          <textarea
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            required
          />
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
        >
          {state === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;