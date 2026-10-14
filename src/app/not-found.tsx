import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Headings";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start py-24">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">We couldn&apos;t find that page.</h1>
      <p className="mt-3 max-w-md text-neutral-600">
        The module or page may have moved. Head back to the training library to keep browsing.
      </p>
      <Link href="/library" className={buttonStyles({ className: "mt-8" })}>
        Back to the library
      </Link>
    </Container>
  );
}
