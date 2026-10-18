
import Image from "next/image";
import Link from "next/link";

import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex h-20 items-center justify-center">
        <Link
          href="/"
          aria-label="Sri Lanka Destination Explorer homepage"
          className="inline-flex items-center"
        >
          <Image
            src="/slde-logo.png"
            alt="Sri Lanka Destination Explorer"
            width={240}
            height={80}
            priority
            className="h-auto w-44 sm:w-52"
          />
        </Link>
      </Container>
    </header>
  );
}