"use client";

import React, { useState } from "react";
import ProfileSkeleton from "@/components/ui/skeleton/profile-skeleton";
import {
  User,
  Mail,
  Phone,
  Building,
  Save,
  Pencil,
  Image as ImageIcon,
  Trash,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const ProfilePageClient: React.FC = () => {
  const { user } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    company: "ExiBy Events",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false); // <--- Editing mode toggle
  const [tempProfile, setTempProfile] = useState(profile); // Temp state while editing
  const [tempImage, setTempImage] = useState<File | null>(image);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempImage(e.target.files[0]);
    }
  };

  const removeTempImage = () => {
    setTempImage(null);
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setTempImage(image);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setTempImage(image);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setImage(tempImage);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your personal information and profile details
          </p>
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
              {tempImage ? (
                <img
                  src={URL.createObjectURL(tempImage)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-xs">No Photo</span>
                </div>
              )}
            </div>

            {/* Image Info */}
            {tempImage && (
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(tempImage.size / 1024)} KB - Ratio: 1:1
              </p>
            )}

            {/* Upload / Change / Remove Buttons */}
            {isEditing && (
              <div className="flex items-center mt-3 space-x-2">
                {/* Choose/Change Photo */}
                <label className="px-4 py-2 text-gray-500  dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 rounded-lg cursor-pointer text-sm flex items-center space-x-1 border border-transparent hover:border-gray-400 transition">
                  {tempImage && <Pencil className="w-4 h-4" />}
                  <span>{tempImage ? "Change Photo" : "Choose Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Remove Photo as text button */}
                {tempImage && (
                  <button
                    onClick={removeTempImage}
                    className="px-4 py-2 text-red-500 hover:text-red-600 rounded-lg text-sm flex items-center space-x-1 border border-transparent hover:border-red-500 transition"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-6">
              {/** Inputs */}
              {["name", "email", "phone", "company"].map((field, idx) => {
                const icons = {
                  name: User,
                  email: Mail,
                  phone: Phone,
                  company: Building,
                };
                const labels = {
                  name: "Full Name",
                  email: "Email Address",
                  phone: "Phone Number",
                  company: "Company",
                };
                const Icon = icons[field as keyof typeof icons];

                return (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {labels[field as keyof typeof labels]}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={tempProfile[field as keyof typeof tempProfile]}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            [field]: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none ${
                          isEditing
                            ? "focus:ring-2 focus:ring-[#0077ED] focus:border-transparent"
                            : "opacity-70 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors flex items-center space-x-1"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#0077ED] hover:bg-[#0066CC] text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageClient;