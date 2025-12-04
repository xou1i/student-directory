import { useState, useEffect, useMemo } from "react";
import "./App.css";

const API_ENDPOINT = "https://68a04cea6e38a02c58184c4b.mockapi.io/users";

const formatDate = (d) => {
  if (!d) return "N/A";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const Avatar = ({ src, name }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=E5E7EB&color=374151&size=128`;

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300 shadow-sm flex items-center justify-center p-1">
      <img
        src={src || fallback}
        onError={(e) => (e.target.src = fallback)}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch students");
      setStudents(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const s = searchTerm.toLowerCase();
    return students.filter(
      (st) =>
        st.name?.toLowerCase().includes(s) ||
        st.email?.toLowerCase().includes(s) ||
        st.major?.toLowerCase().includes(s)
    );
  }, [students, searchTerm]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-xl p-10">
        <div className="p-8">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-gray-50 p-10">
        <p className="text-gray-700 text-lg p-4">{error}</p>
        <button
          onClick={loadStudents}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-12 md:p-16 lg:p-20">
      <div className="w-full max-w-5xl flex flex-col gap-12 md:gap-16">

        {/* Header */}
        <header className="text-center flex flex-col gap-4 p-8 md:p-10">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight p-2">
            Students Directory
          </h1>
          <p className="text-gray-500 text-lg p-2">
            A clean, simple, professional students table.
          </p>
        </header>

        {/* Search */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 md:p-10 flex flex-col gap-5">
          <label className="text-gray-700 text-sm font-medium p-2">
            Search Students
          </label>

          <input
            type="text"
            placeholder="Search by name, email or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden p-2">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {["Avatar", "Name", "Email", "Major", "Stage", "Level", "Created At"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="py-6 px-8 text-left text-sm font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-16 px-8 text-center text-gray-500 text-lg"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                filtered.map((st, i) => (
                  <tr
                    key={st.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-200`}
                  >
                    <td className="py-6 px-8">
                      <Avatar src={st.avatar} name={st.name} />
                    </td>
                    <td className="py-6 px-8 text-gray-800 font-medium">
                      {st.name}
                    </td>
                    <td className="py-6 px-8 text-gray-600">{st.email}</td>
                    <td className="py-6 px-8 text-gray-600">{st.major || "N/A"}</td>

                    <td className="py-6 px-8">
                      <span className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 text-sm">
                        {st.stage || "N/A"}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <span className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 text-sm">
                        {st.level || "N/A"}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-gray-500">
                      {formatDate(st.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
