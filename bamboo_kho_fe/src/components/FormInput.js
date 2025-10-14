import React from "react";

const FormInput = ({ label, type, value, onChange }) => (
  <div className="form-group mb-3">
    <label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
);

export default FormInput;
