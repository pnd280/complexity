export const cookies = [
  {
    domain: "www.perplexity.ai",
    httpOnly: true,
    name: "next-auth.csrf-token",
    path: "/",
    secure: true,
    value: process.env.NEXT_AUTH_CSRF_TOKEN || "",
  },
  {
    domain: "www.perplexity.ai",
    httpOnly: true,
    name: "__Secure-next-auth.session-token",
    path: "/",
    secure: true,
    value: process.env.NEXT_AUTH_SESSION_TOKEN || "",
  },
];
