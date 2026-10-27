export async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  
  // Development test bypass: allow testing if secret key is not set or mock test token used
  if (!secretKey || token === "test-token" || process.env.NODE_ENV === "development") {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error("[Turnstile] Validation error:", err);
    return false;
  }
}
