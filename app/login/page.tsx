"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function LoginPage() {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  // We remove the automatic redirect useEffect here. 
  // Redirection will now happen via the Modal's onConfirm callback.
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    state: "",
    district: "",
    landArea: "",
    income: "",
    crops: [""] as string[], // Changed to array
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCropChange = (index: number, value: string) => {
    const newCrops = [...formData.crops];
    newCrops[index] = value;
    setFormData({ ...formData, crops: newCrops });
  };

  const addCropField = () => {
    setFormData({ ...formData, crops: [...formData.crops, ""] });
  };

  const removeCropField = (index: number) => {
    const newCrops = formData.crops.filter((_, i) => i !== index);
    setFormData({ ...formData, crops: newCrops });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password,
        });
        setModalConfig({
          isOpen: true,
          title: "Welcome Back",
          message: "Login successful! Redirecting to your dashboard...",
          type: "success",
          onConfirm: () => router.push("/")
        });
      } else {
        await register({
          username: formData.username, // Using username as email
          name: formData.name,
          state: formData.state,
          district: formData.district,
          landArea: formData.landArea,
          income: formData.income,
          crops: formData.crops.filter(c => c.trim() !== ""), // Filter empty
          age: formData.age ? parseInt(formData.age) : undefined,
        }, formData.password);
        setModalConfig({
          isOpen: true,
          title: "Registration Complete",
          message: "You have successfully joined the network. Welcome aboard!",
          type: "success",
          onConfirm: () => router.push("/")
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        title: isLogin ? "Login Failed" : "Registration Failed",
        message: isLogin
          ? "Incorrect username or password. Please try again."
          : error.message?.includes("already registered")
            ? "This username is already taken. Please try another."
            : "An error occurred during registration. Please check your details.",
        type: "error",
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111827] relative overflow-hidden font-sans text-gray-900 dark:text-gray-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          alt="Blurred golden wheat field at sunset"
          className="w-full h-full object-cover filter blur-[2px] opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbja_p9hBcKIPH7ip93_gWOhYQb21xj5ZUsIDGiJ4oOQ_tQQkFfx1WSEJjtnbS9b0bJClSW1Xy_dI2ajaiW3sU6LsHU3W4pTTvne11ATwrh8aWDfLCE_3w4scxmfIVgtRqRYJJQC6v3DSlI4yksbQMqBMvlrh8InMlmWo0hsab3Bmgdyfo7Rfis7FZesw0jcY13H2wGlrTdaSpMm2dHH9XLZHLzYFy7SJVMK_DK2HvQa1dzr9-1YXBrGMh8IZtn0P1rtrnr-3FNc8"
        />
        <div className="absolute inset-0 bg-white/50 dark:bg-[#0f110f]/80 transition-colors duration-700"></div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 group flex items-center justify-center w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-emerald-500/30 active:scale-95"
      >
        <span className="material-icons-round text-xl text-gray-600 dark:text-gray-300 transition-transform duration-500 group-hover:rotate-180 group-hover:text-emerald-600 dark:group-hover:text-[#6ee7b7]">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>

      <div className="w-full max-w-2xl z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
        >
          {/* Header */}
          <div className="mb-10 text-center flex flex-col items-center">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-extrabold text-2xl tracking-tight text-gray-950 dark:text-white">
                <span className="text-emerald-700 dark:text-[#6ee7b7]">Krishi</span> Setu
              </span>
            </Link>
            <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tighter mb-2">
              {isLogin ? (
                <>Welcome <span className="text-emerald-700 dark:text-[#6ee7b7]">Back</span></>
              ) : (
                <>Join the <span className="text-emerald-700 dark:text-[#6ee7b7]">Network</span></>
              )}
            </h1>
            <p className="text-gray-950 dark:text-gray-300 max-w-sm text-sm tracking-wide font-medium">
              {isLogin ? "Access your intelligent farming dashboard." : "Register to access smart agricultural tools."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="@username"
                  required
                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.username}
                  onChange={handleChange}
                  autoCapitalize="none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      required={!isLogin}
                      className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        placeholder="e.g. 35"
                        required={!isLogin}
                        min="0"
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Punjab"
                        required={!isLogin}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">District</label>
                      <input
                        type="text"
                        name="district"
                        placeholder="e.g. Ludhiana"
                        required={!isLogin}
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Land Area (Acres)</label>
                      <input
                        type="number"
                        name="landArea"
                        placeholder="e.g. 5"
                        required={!isLogin}
                        min="0"
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        value={formData.landArea}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Annual Income (₹)</label>
                      <input
                        type="number"
                        name="income"
                        placeholder="e.g. 300000"
                        required={!isLogin}
                        min="0"
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                        value={formData.income}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Dynamic Crops Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 uppercase ml-1">Crops</label>
                    {formData.crops.map((crop, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Crop ${index + 1} (e.g. Wheat)`}
                          required={!isLogin && index === 0}
                          className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                          value={crop}
                          onChange={(e) => handleCropChange(index, e.target.value)}
                        />
                        {formData.crops.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCropField(index)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          >
                            <span className="material-icons-round text-lg">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCropField}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-emerald-500/30 text-emerald-600 dark:text-[#6ee7b7] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors mt-2 text-xs font-bold font-mono tracking-widest uppercase"
                    >
                      <span className="material-icons-round text-base">add</span>
                      Add another crop
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                isLogin ? "Login" : "Register"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold font-mono tracking-widest text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-[#6ee7b7] uppercase transition-colors"
            >
              {isLogin ? "New to Krishi Setu? Create Account" : "Already have an account? Login"}
            </button>
          </div>
        </motion.div>
      </div>
      <Modal
        {...modalConfig}
      />
    </div>
  );
}
