import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getProfile } from "@/lib/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Abhisek Saha — Front End Developer from Kolkata.",
};

export default async function ContactPage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <>
      <Navbar name={profile.full_name} />
      <main className="pt-24">
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
