"use client";

import Spinner from "@/app/(commonLayout)/Spinner";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/featured/auth/authApi";
import { useRunningPackageQuery } from "@/redux/featured/Package/packageApi";
import { Bird, Upload, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MdEmail } from "react-icons/md";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { getImageUrl } from "../share/imageUrl";

export default function ProfileDashboardComponents() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: profileResponse, isLoading, refetch } = useMyProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    contact: "",
  });
  const [phoneError, setPhoneError] = useState("");

  // Extract user data from the response
  const userData = profileResponse;
  console.log("profile", userData);
  console.log(userData?.name);

  const { data: packageResponse } = useRunningPackageQuery();
  const packageData = packageResponse?.data;

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        userName: userData.userName || "",
        email: userData.email || "",
        contact: userData.contact || "",
      });
      // Use profile field from API response instead of image
      setImagePreview(userData.profile || getImageUrl(userData.profile));
    }
  }, [userData]);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, contact: value || "" });

    // Validate phone number
    if (value) {
      if (!isValidPhoneNumber(value)) {
        setPhoneError("Invalid phone number for selected country");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if phone is valid before submitting
    if (formData.contact && !isValidPhoneNumber(formData.contact)) {
      setPhoneError(
        "Please enter a valid phone number for the selected country"
      );
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        userName: formData.userName,
        email: formData.email,
        contact: formData.contact,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(updateData));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await updateProfile({ data: formDataToSend }).unwrap();

      if (response.success) {
        toast.success("Profile updated successfully!");
        if (response.token) {
          localStorage.setItem("accessToken", response.token);
        }
        // Refetch profile data to update UI immediately
        refetch();
        setOpen(false);
        // Reset image file state
        setImageFile(null);
      } else {
        toast.error(response.message || "Failed to update profile!");
      }
    } catch (error) {
      toast.error(
        error.data?.message || "An error occurred while updating the profile"
      );
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl border border-gray-200 shadow-sm mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {imagePreview ? (
                <Image
                  src={getImageUrl(userData?.profile)}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={40} />
                </div>
              )}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {userData?.name || userData?.userName}
            </h2>
            <p className="text-gray-600">{userData?.email}</p>
            <p className="text-gray-500 mt-1">{userData?.contact}</p>
          </div>
        </div>

        <div className="bg-white">
          {" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-accent-foreground hover:bg-accent-foreground/90 shadow-sm"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-lg text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  Edit Profile
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 ">
                <div className="flex flex-col items-center ">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer group text-white"
                  >
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                      {imagePreview ? (
                        <Image
                          src={getImageUrl(userData?.profile)}
                          alt="Profile Preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <Upload size={24} className="mb-2" />
                          <span className="text-sm">Upload Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={20} />
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-white mt-2">
                    Click to upload profile picture
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="py-3"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Username
                    </label>
                    <Input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      className="py-3"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-white mb-1">
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-3 cursor-not-allowed bg-"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Contact Number
                    </label>
                    <Input
                      international
                      defaultCountry="BD"
                      value={formData.contact}
                      onChange={handlePhoneChange}
                      className={`w-full border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        phoneError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {phoneError && (
                      <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                  disabled={updating || (formData.contact && phoneError)}
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-accent">
                <Bird size={24} />
              </div>
              <h3 className="font-medium text-white">Total Pigeons</h3>
            </div>
            <p className="text-4xl font-bold mt-4 text-gray-800">
              {userData?.totalPigeons || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-accent">
                <User2 size={24} />
              </div>
              <h3 className="font-medium text-white"> User Name </h3>
            </div>
            <p className="text-lg font-bold mt-4 text-gray-800">
              {userData?.name || userData?.userName}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-accent">
                <MdEmail size={24} />
              </div>
              <h3 className="font-medium text-white">Email</h3>
            </div>
            <p className="text-lg font-bold mt-4 text-gray-800">
              {userData?.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <SubscriptionCard packageData={packageData} userData={userData} /> */}
    </div>
  );
}
