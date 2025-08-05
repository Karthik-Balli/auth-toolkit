const Button = ({ type = "button", children, onClick, disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow duration-300 transition-alldisabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
