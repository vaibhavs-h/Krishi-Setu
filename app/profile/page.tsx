"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";

export default function ProfilePage() {
  const { user, isLoading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success"
  });

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    land_area: "",
    crops: [] as string[], // Fixed to array
    age: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchProfile();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || "",
          username: data.username || "",
          location: data.location || "",
          land_area: data.land_area?.toString() || "",
          // Ensure it's always an array
          crops: Array.isArray(data.crops) ? data.crops : (data.crops ? [data.crops] : []),
          age: data.age?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) throw new Error("No user logged in");

      const updates = {
        id: user.id,
        name: formData.name,
        // Username is typically read-only or requires unique check, simplifying for now to allow edits if needed, 
        // but often best to keep ID stable. Let's allow editing other fields primarily.
        location: formData.location,
        land_area: parseFloat(formData.land_area) || 0,
        crops: formData.crops.filter(c => c.trim() !== ""), // Filter empty
        age: formData.age ? parseInt(formData.age) : null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile(); // Sync local context
      setModalConfig({
        isOpen: true,
        title: "Profile Updated",
        message: "Your profile has been updated successfully!",
        type: "success",
        onConfirm: () => router.push("/")
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        title: "Update Failed",
        message: error.message || "Failed to update profile. Please try again.",
        type: "error",
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-gray-900 dark:text-gray-200">
      <div className="absolute inset-0 bg-gray-50 dark:bg-[#020402] -z-10" />
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          alt="Blurred golden wheat field at sunset"
          className="w-full h-full object-cover filter blur-[2px] opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbja_p9hBcKIPH7ip93_gWOhYQb21xj5ZUsIDGiJ4oOQ_tQQkFfx1WSEJjtnbS9b0bJClSW1Xy_dI2ajaiW3sU6LsHU3W4pTTvne11ATwrh8aWDfLCE_3w4scxmfIVgtRqRYJJQC6v3DSlI4yksbQMqBMvlrh8InMlmWo0hsab3Bmgdyfo7Rfis7FZesw0jcY13H2wGlrTdaSpMm2dHH9XLZHLzYFy7SJVMK_DK2HvQa1dzr9-1YXBrGMh8IZtn0P1rtrnr-3FNc8"
        />
        <div className="absolute inset-0 bg-white/50 dark:bg-[#0f110f]/80 transition-colors duration-700"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-12 relative z-10">
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
            <div>
              <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2">
                Edit <span className="text-emerald-700 dark:text-[#6ee7b7]">Profile</span>
              </h1>
              <p className="text-gray-950 dark:text-gray-300 max-w-2xl text-sm md:text-base tracking-wide font-medium">
                Update your account and farming details.
              </p>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-[#6ee7b7] bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest">
                User Settings
              </span>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-[var(--neon-green)]/50 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[var(--neon-green)]/50 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 outline-none font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    placeholder="@username"
                  />
                  <p className="text-[10px] text-gray-400">Username cannot be changed</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-[var(--neon-green)]/50 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[var(--neon-green)]/50 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                    placeholder="E.g. 45"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    Farm Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-[var(--neon-green)]/50 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[var(--neon-green)]/50 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                    placeholder="e.g. Nashik, Maharashtra"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    Land Area (Acres)
                  </label>
                  <input
                    type="number"
                    name="land_area"
                    value={formData.land_area}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-[var(--neon-green)]/50 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[var(--neon-green)]/50 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase">Crops</label>
                    {(formData.crops).map((crop, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Crop ${index + 1}`}
                          className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                          value={crop}
                          onChange={(e) => {
                            const newCrops = [...formData.crops];
                            newCrops[index] = e.target.value;
                            setFormData({ ...formData, crops: newCrops });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCrops = formData.crops.filter((_, i) => i !== index);
                            setFormData({ ...formData, crops: newCrops });
                          }}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <span className="material-icons-round text-lg">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, crops: [...formData.crops, ""] })}
                      className="text-xs font-bold font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase opacity-80 hover:opacity-100 flex items-center gap-1 mt-1 ml-1 transition-opacity"
                    >
                      <span className="material-icons-round text-base">add</span>
                      Add another crop
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.type === 'success' ? 'Return to Dashboard' : 'OK'}
      />
    </div>
  );
}
