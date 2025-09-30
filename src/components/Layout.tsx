import type { ReactNode } from "react";
import { Container } from "@radix-ui/themes";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container size="4" px="4" mt="8">
      {children}
    </Container>
  );
}
