import React from "react";
import { useForm } from "react-hook-form";

const AddressForm = ({ initialValues, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {
      isOtherPerson: false,
      recipientName: "",
    },
  });

  const isOtherPerson = watch("isOtherPerson");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-5 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {initialValues ? "Editar Dirección" : "Nueva Dirección"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("isOtherPerson")}
            className="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
          <span className="ml-2 text-gray-700">¿Es para otra persona?</span>
        </label>
      </div>

      {isOtherPerson && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Destinatario
          </label>
          <input
            {...register("recipientName", { required: "Este campo es requerido" })}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre completo del receptor"
          />
          {errors.recipientName && (
            <p className="text-red-500 text-sm mt-1">{errors.recipientName.message}</p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección Completa
        </label>
        <input
          {...register("addressLine", { required: "Este campo es requerido" })}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Calle, número, colonia"
        />
        {errors.addressLine && (
          <p className="text-red-500 text-sm mt-1">{errors.addressLine.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input
            {...register("city", { required: "Este campo es requerido" })}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ciudad"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <input
            {...register("state")}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Estado"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
          <input
            {...register("pincode", {
              required: "Este campo es requerido",
              pattern: {
                value: /^\d{5}$/,
                message: "Código postal inválido"
              }
            })}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Código Postal"
          />
          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
          <input
            {...register("country", { required: "Este campo es requerido" })}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="País"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono de Contacto
        </label>
        <input
          {...register("mobile", {
            required: "Este campo es requerido",
            pattern: {
              value: /^\d{10}$/,
              message: "Número inválido (10 dígitos)"
            }
          })}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Número de 10 dígitos"
        />
        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {initialValues ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;