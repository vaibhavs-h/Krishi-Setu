"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, deleteProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
    onConfirm: () => { },
    onCancel: undefined as (() => void) | undefined,
    confirmText: "OK",
    cancelText: "Cancel"
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleUserIconClick = () => {
    if (user) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      router.push("/login");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full px-8 py-6 flex justify-between items-center relative z-50">
      <Link href="/" className="glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-6 py-3 rounded-full flex items-center space-x-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <span className="font-display font-bold text-lg tracking-tight text-gray-950 dark:text-white">
          <span className="text-emerald-700 dark:text-[#6ee7b7]">Krishi</span> Setu
        </span>
        <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-slate-950 dark:text-gray-400 pl-2 border-l border-gray-400 dark:border-gray-600 font-bold font-mono">
          Cultivating Innovation
        </span>
      </Link>

      <nav className="hidden md:flex items-center space-x-1 glass-panel bg-white/70 dark:bg-[rgba(18,24,21,0.7)] px-2 py-2 rounded-full">
        {[
          { name: "Dashboard", path: "/" },
          { name: "Markets", path: "/market" },
          { name: "Finance", path: "/financial" },
          { name: "Schemes", path: "/schemes" },
          { name: "Advisory", path: "/advisory" },
        ].map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`px-4 py-1.5 text-sm font-bold font-mono tracking-wide rounded-full transition-all duration-300 ${isActive(item.path)
              ? "text-black dark:text-[#6ee7b7] bg-white/50 dark:bg-white/10 shadow-sm scale-105"
              : "text-slate-950 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-[rgba(18,24,21,0.7)] border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-emerald-500/30 active:scale-95"
        >
          <span className="material-icons-round text-xl text-gray-600 dark:text-gray-300 transition-transform duration-500 group-hover:rotate-180 group-hover:text-emerald-600 dark:group-hover:text-[#6ee7b7]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <div className="relative" ref={wrapperRef}>
          <button
            onClick={handleUserIconClick}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/70 dark:bg-[rgba(18,24,21,0.7)] border shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${showProfileMenu ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/20 dark:border-white/10 hover:border-emerald-500/30'}`}
          >
            <span className={`material-icons-round text-xl transition-colors ${showProfileMenu ? 'text-emerald-600 dark:text-[#6ee7b7]' : 'text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-[#6ee7b7]'}`}>
              {user ? 'person' : 'account_circle'}
            </span>
          </button>

          {showProfileMenu && user && (
            <div className="absolute right-0 mt-3 w-64 origin-top-right transform transition-all duration-200 ease-out z-50">
              <div className="bg-white/90 dark:bg-[#0a0c0a]/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-black/5">
                <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/10">
                  <p className="text-sm font-bold font-mono tracking-wide text-gray-900 dark:text-white truncate">{user.name || 'Farmer'}</p>
                  <p className="text-xs font-mono tracking-wide text-emerald-600 dark:text-[#6ee7b7] truncate mt-0.5">@{user.username}</p>
                </div>

                <div className="p-2 space-y-1">
                  <Link href="/profile" className="w-full text-left px-4 py-2.5 text-sm font-bold font-mono tracking-wide text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3 group">
                    <span className="material-icons-round text-lg text-gray-400 group-hover:text-emerald-500 transition-colors">edit</span>
                    Edit Profile
                  </Link>
                </div>

                <div className="p-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setModalConfig({
                        isOpen: true,
                        title: "Delete Profile",
                        message: "Are you sure you want to delete your profile? This action is irreversible.",
                        type: "warning",
                        onConfirm: async () => {
                          try {
                            setModalConfig(prev => ({ ...prev, isOpen: false }));
                            await deleteProfile();
                            // Optional: Show success later if needed
                          } catch (error) {
                            console.error("Failed to delete profile", error);
                            setModalConfig(prev => ({
                              ...prev,
                              isOpen: true,
                              title: "Error",
                              message: "Failed to delete profile. Please try again.",
                              type: "error",
                              onConfirm: () => setModalConfig(p => ({ ...p, isOpen: false })),
                              onCancel: undefined,
                              confirmText: "OK",
                              cancelText: "Cancel"
                            }));
                          }
                        },
                        onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
                        confirmText: "Delete",
                        cancelText: "Cancel"
                      });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold font-mono tracking-wide text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-3 mb-1 group"
                  >
                    <span className="material-icons-round text-lg text-red-400 group-hover:text-red-500">person_remove</span>
                    Delete Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setModalConfig({
                        isOpen: true,
                        title: "Sign Out",
                        message: "Are you sure you want to sign out?",
                        type: "info",
                        onConfirm: async () => {
                          setModalConfig(prev => ({ ...prev, isOpen: false }));
                          await logout();
                        },
                        onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
                        confirmText: "Sign Out",
                        cancelText: "Cancel"
                      });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold font-mono tracking-wide text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3 group"
                  >
                    <span className="material-icons-round text-lg text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal {...modalConfig} />
    </header>
  );
}
