"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useContactUsMutation } from "@/redux/featured/contact/contactUsApi";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactUs, { isLoading }] = useContactUsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated payload to match backend expectations
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      description: formData.message, // Changed from 'message' to 'description'
    };

    try {
      const result = await contactUs(payload).unwrap();
      toast.success("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto max-h-screen flex items-center justify-center  rounded-lg mt-20" id="contact-us">
      <CardContent className="p-6">
        <div className="mb-12 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-semibold flex justify-center items-center mb-6">
             <span className="text-accent mr-2 ">Contact</span>  us
          </h2>
          <p className="text-destructive text-sm mt-1">
            We’re here to help. If you have any questions, feedback, or remarks,
            feel free to reach out to us at: <span className="text-accent-foreground mx-2 font-bold">info@ThePigeonHub.com</span>  
            Our team will get back to you as soon as possible
          </p>
        </div>
{/* 
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
          </div>

          <Input
            name="subject"
            placeholder="Write Your Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="rounded-md py-7"
          />

          <Textarea
            name="message"
            placeholder="Write Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="min-h-32 rounded-md py-7"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white rounded-md py-7 mt-10"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form> */}
      </CardContent>
    </div>
  );
}
