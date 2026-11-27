import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

export const colors = { linen: "#f3ede3", paper: "#f9f6f0", ink: "#211a16", espresso: "#211a16", bronze: "#7a6049", stone: "#6b5b4d" };
export const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
export const sans = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

export function Layout({ preview, siteUrl, children, unsubscribeUrl }: { preview: string; siteUrl: string; children: ReactNode; unsubscribeUrl?: string }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.linen, margin: 0, padding: "32px 0", fontFamily: sans, color: colors.ink }}>
        <Container style={{ maxWidth: 560, backgroundColor: colors.paper, padding: "40px 36px" }}>
          <Section style={{ textAlign: "center" }}>
            <Img src={`${siteUrl}/brand/tnc-emblem.png`} width="84" height="84" alt="The November Couple" style={{ margin: "0 auto" }} />
          </Section>
          {children}
          <Hr style={{ borderColor: "#ddd1c1", margin: "36px 0 20px" }} />
          <Text style={{ fontSize: 11, color: colors.stone, textAlign: "center", lineHeight: "18px", margin: 0 }}>
            The November Couple · <Link href={siteUrl} style={{ color: colors.stone }}>thenovembercouple.com</Link>
            {unsubscribeUrl && (
              <>
                {" · "}
                <Link href={unsubscribeUrl} style={{ color: colors.stone }}>Unsubscribe</Link>
              </>
            )}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={{ fontFamily: serif, fontSize: 34, lineHeight: "40px", textAlign: "center", margin: "28px 0 8px", color: colors.ink }}>{children}</Text>;
}

export function P({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 15, lineHeight: "24px", color: colors.espresso, margin: "12px 0" }}>{children}</Text>;
}

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Section style={{ textAlign: "center", margin: "28px 0" }}>
      <Link
        href={href}
        style={{ backgroundColor: colors.ink, color: colors.paper, padding: "14px 28px", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
      >
        {children}
      </Link>
    </Section>
  );
}
