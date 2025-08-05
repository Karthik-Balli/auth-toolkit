const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        {...rest}
      />
    </div>
  );
};

export default Input;
