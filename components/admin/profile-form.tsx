"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import type { Profile } from "@/types/database";
import Image from "next/image";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePortfolio } from "@/lib/actions/revalidate";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [imageUrl, setImageUrl] = useState(profile.profile_image_url);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name,
      professional_title: profile.professional_title,
      bio: profile.bio,
      location: profile.location ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      github_url: profile.github_url ?? "",
      linkedin_url: profile.linkedin_url ?? "",
      greeting: profile.greeting ?? "",
      hero_description: profile.hero_description ?? "",
      cta_projects_label: profile.cta_projects_label ?? "",
      cta_resume_label: profile.cta_resume_label ?? "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileName = `profile-${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("profile-images").upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName);
      setImageUrl(data.publicUrl);

      await supabase.from("profiles").update({ profile_image_url: data.publicUrl }).eq("id", profile.id);
      setToast({ message: "Profile image updated", type: "success" });
      await revalidatePortfolio();
    } catch {
      setToast({ message: "Failed to upload image", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      const supabase = createClient();
      await supabase.from("profiles").update({ profile_image_url: null }).eq("id", profile.id);
      setImageUrl(null);
      setToast({ message: "Profile image removed", type: "success" });
      await revalidatePortfolio();
    } catch {
      setToast({ message: "Failed to remove image", type: "error" });
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").update(data).eq("id", profile.id);
      if (error) throw error;
      setToast({ message: "Profile updated successfully", type: "success" });
      await revalidatePortfolio();
    } catch {
      setToast({ message: "Failed to update profile", type: "error" });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-border/30 border border-border">
              {imageUrl ? (
                <Image src={imageUrl} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-bold text-muted">
                  {profile.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()} loading={uploading}>
                <Upload className="h-4 w-4" /> Upload
              </Button>
              {imageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={removeImage}>
                  <X className="h-4 w-4" /> Remove
                </Button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" error={errors.full_name?.message} {...register("full_name")} />
          <Input label="Professional Title" error={errors.professional_title?.message} {...register("professional_title")} />
        </div>

        <Textarea label="Bio" error={errors.bio?.message} rows={5} {...register("bio")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Location" {...register("location")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Greeting" placeholder="Hello, I'm" {...register("greeting")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="GitHub URL" error={errors.github_url?.message} {...register("github_url")} />
          <Input label="LinkedIn URL" error={errors.linkedin_url?.message} {...register("linkedin_url")} />
        </div>

        <Textarea label="Hero Description" rows={3} {...register("hero_description")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Projects CTA Label" {...register("cta_projects_label")} />
          <Input label="Resume CTA Label" {...register("cta_resume_label")} />
        </div>

        <Button type="submit" loading={isSubmitting}>Save Profile</Button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
