import PageUnavailable from "@/components/PageUnavailable";

export default function NotFound() {
  return (
    <PageUnavailable
      code="404"
      title="Page not found"
      message="The page you were looking for does not exist or may have been moved."
      autoRedirect
    />
  );
}