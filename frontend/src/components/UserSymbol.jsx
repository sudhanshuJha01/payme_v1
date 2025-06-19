const UserSymbol = ({ label = "U", onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="User menu"
      title="User menu"
      className="bg-white w-10 h-10 rounded-full text-black font-semibold text-xl flex items-center justify-center hover:scale-105 transition-transform duration-150 cursor-pointer"
    >
      {label}
    </button>
  );
};

export default UserSymbol;
