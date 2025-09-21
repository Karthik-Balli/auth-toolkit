import useAuth from "../hooks/useAuth";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">
        👋 Welcome,{" "}
        <span className="text-blue-600">{user?.name || "User"}</span>
      </h1>

      <button
        onClick={logout}
        className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
