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

const Highlight = ({ text, term }) => {
  if (!term.trim() || !text) return <span>{text}</span>;
  // Escape special regex characters to prevent crashes
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = String(text).split(new RegExp(`(${escapedTerm})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="bg-blue-500/30 text-blue-400 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const Avatar = ({ src, name }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=1f2937&color=60a5fa&size=128`;

  return (
    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-lg flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
      <img
        src={src || fallback}
        onError={(e) => (e.target.src = fallback)}
        alt={name}
        className="w-full h-full object-cover rounded-lg"
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-blue-400 text-xl p-10 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="animate-pulse">Loading Directory...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-[#0a0a0a] p-10 text-white">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-md">
          <p className="text-red-400 text-lg mb-6">{error}</p>
          <button
            onClick={loadStudents}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 transition-colors text-white rounded-xl shadow-lg shadow-blue-500/20 font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-24 pb-24 px-8 md:px-16 lg:px-24 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-7xl flex flex-col gap-10">

        {/* Header */}
        <header className="text-center flex flex-col gap-2 mt-10  b-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            Student <span className="text-blue-500">Directory</span>
          </h1>
          <p className="text-gray-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            Professional Academic Records
          </p>
        </header>

        {/* Search */}
        <div className="flex flex-col gap-4 group">
          <div className="flex items-center justify-between px-4">
            <label className="text-blue-500/60 text-xs font-black uppercase tracking-[0.2em]">
              Filter Records
            </label>
            <span className="text-gray-700 text-[10px] uppercase font-bold tracking-widest">
              {filtered.length} Entries found
            </span>
          </div>
          <div className="relative p-4">
            <input
              type="text"
              placeholder="Search by name, email or major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-16 py-5 rounded-2xl bg-white/3 border border-white/10 text-white placeholder:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/5 transition-all duration-300 shadow-2xl"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr>
                  {["Avatar", "Name", "Email", "Major", "Stage", "Level", "Created At"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="pb-6 px-10 text-left text-xs font-black text-blue-500 uppercase tracking-[0.25em]"
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
                      className="py-32 px-10 text-center text-gray-500 text-2xl font-extralight italic bg-white/2 rounded-4xl border border-white/5"
                    >
                      No records match the active filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((st, i) => (
                    <tr
                      key={st.id}
                      className="group transition-all duration-300 transform"
                    >
                      <td className="py-8 px-10 bg-white/3 border-y border-l border-white/10 rounded-l-3xl group-hover:bg-blue-500/5 transition-colors">
                        <Avatar src={st.avatar} name={st.name} />
                      </td>
                      <td className="py-8 px-10 bg-white/3 border-y border-white/10 text-white font-bold text-lg tracking-tight group-hover:bg-blue-500/5 transition-colors min-w-[200px]">
                        <Highlight text={st.name} term={searchTerm} />
                      </td>
                      <td className="py-8 px-10 bg-white/3 border-y border-white/10 text-gray-400 font-light group-hover:bg-blue-500/5 transition-colors min-w-[240px]">
                        <Highlight text={st.email} term={searchTerm} />
                      </td>
                      <td className="py-8 px-10 bg-white/3 border-y border-white/10 text-gray-300 group-hover:bg-blue-500/5 transition-colors min-w-[180px]">
                        <Highlight text={st.major || "N/A"} term={searchTerm} />
                      </td>

                      <td className="py-8 px-10 bg-white/[0.03] border-y border-white/10 group-hover:bg-blue-500/[0.05] transition-colors">
                        <span className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-black backdrop-blur-md">
                          {st.stage || "N/A"}
                        </span>
                      </td>

                      <td className="py-8 px-10 bg-white/[0.03] border-y border-white/10 group-hover:bg-blue-500/[0.05] transition-colors">
                        <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-xs font-black backdrop-blur-md">
                          {st.level || "N/A"}
                        </span>
                      </td>

                      <td className="py-8 px-10 bg-white/3 border-y border-r border-white/10 rounded-r-3xl text-gray-500 text-sm font-light group-hover:bg-blue-500/5 transition-colors whitespace-nowrap">
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
    </div>
  );
}

export default App;
