import { supabase, isSupabaseConfigured } from "../supabase/client";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  websiteHoneypot?: string; // Invisible spam honeypot
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Validates and submits a contact form message to Supabase.
 */
export async function submitContactMessage(
  formData: ContactFormData
): Promise<ContactResponse> {
  // 1. Anti-spam honeypot verification
  if (formData.websiteHoneypot && formData.websiteHoneypot.trim() !== "") {
    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  }

  // 2. Strict Input Validation
  const name = formData.name.trim();
  const email = formData.email.trim();
  const message = formData.message.trim();

  if (!name || name.length < 2) {
    return {
      success: false,
      message: "Please provide your name (at least 2 characters).",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  if (!message || message.length < 5) {
    return {
      success: false,
      message: "Please write a message with at least 5 characters.",
    };
  }

  if (message.length > 3000) {
    return {
      success: false,
      message: "Message is too long (maximum 3000 characters).",
    };
  }

  // 3. Fallback if Supabase is not yet initialized
  if (!isSupabaseConfigured) {
    console.warn(
      "Supabase is not configured. Contact message logged locally:",
      { name, email, message }
    );
    return {
      success: true,
      message: "Thank you! Your message has been received.",
    };
  }

  // 4. Store in Supabase
  try {
    const { error } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        message,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        success: false,
        message: "Failed to send message. Please try again or reach out via email.",
      };
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  } catch (err) {
    console.error("Unexpected error in submitContactMessage:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
