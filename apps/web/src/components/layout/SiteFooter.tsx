
import { Container } from "./Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="py-6">
        <p className="text-center text-sm text-muted">
          © {new Date().getFullYear()} Sri Lanka Destination Explorer.
          All rights reserved.
        </p>
      </Container>
    </footer>
  );
}