import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  firstName?: string | null
  heading?: string
  bodyText?: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  preview?: string
}

const DEFAULT_HEADING = 'Welcome{{firstNameComma}}.'
const DEFAULT_BODY = `You're now a member of Sunset Social Club. You can access your Member Home at https://sunsetsocialclub.org/member, which includes:

- Things members have shared
- Photos from our gatherings
- Community links (e.g. Spotify playlist)
- Member feedback
- and more!

Sign in with your email any time to take a look.`
const DEFAULT_CTA_LABEL = 'Go to Member Home'
const DEFAULT_CTA_URL = 'https://sunsetsocialclub.org/member'

export function renderTokens(input: string, firstName?: string | null): string {
  const name = (firstName ?? '').trim()
  return input
    .replace(/\{\{\s*firstNameComma\s*\}\}/g, name ? `, ${name}` : '')
    .replace(/\{\{\s*firstName\s*\}\}/g, name)
}

const MemberWelcome = ({
  firstName,
  heading = DEFAULT_HEADING,
  bodyText = DEFAULT_BODY,
  ctaLabel = DEFAULT_CTA_LABEL,
  ctaUrl = DEFAULT_CTA_URL,
  preview = "You're now a member of Sunset Social Club",
}: Props) => {
  const finalHeading = renderTokens(heading, firstName)
  const finalBody = renderTokens(bodyText, firstName)
  const finalCtaLabel = ctaLabel ? renderTokens(ctaLabel, firstName) : ''
  const finalCtaUrl = ctaUrl ?? ''
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={crest}>
            <Text style={crestLabel}>Sunset Social Club</Text>
          </Section>
          <Heading style={h1}>{finalHeading}</Heading>
          {finalBody.split(/\n\n+/).map((para, i) => {
            const lines = para.split('\n').map((l) => l.trim()).filter(Boolean)
            const isList = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l))
            if (isList) {
              return (
                <Section key={i} style={{ margin: '0 0 14px' }}>
                  {lines.map((l, j) => (
                    <Text key={j} style={bullet}>{'\u2022 ' + l.replace(/^[-*]\s+/, '')}</Text>
                  ))}
                </Section>
              )
            }
            return <Text key={i} style={lede}>{para}</Text>
          })}
          {finalCtaLabel && finalCtaUrl && (
            <Section style={{ textAlign: 'center', margin: '20px 0 28px' }}>
              <Button href={finalCtaUrl} style={btn}>{finalCtaLabel}</Button>
            </Section>
          )}
          {finalCtaUrl && (
            <Text style={fallback}>
              Or open this link: <a href={finalCtaUrl} style={link}>{finalCtaUrl}</a>
            </Text>
          )}
          <Text style={sig}>Sunset, San Francisco</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: MemberWelcome,
  subject: "You're in, welcome to Sunset Social Club",
  displayName: 'Member welcome',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Nunito, Helvetica, Arial, sans-serif',
  color: '#1d1c1a',
}
const container = {
  padding: '40px 28px',
  maxWidth: '520px',
  textAlign: 'center' as const,
}
const crest = {
  borderTop: '1px solid rgba(29,28,26,0.15)',
  borderBottom: '1px solid rgba(29,28,26,0.15)',
  padding: '10px 0',
  marginBottom: '28px',
}
const crestLabel = {
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: '#1d1c1a',
  margin: 0,
  fontWeight: 700,
}
const h1 = {
  fontSize: '28px',
  fontWeight: 800,
  fontStyle: 'italic' as const,
  color: '#1d1c1a',
  margin: '0 0 14px',
  lineHeight: 1.15,
}
const bullet = {
  fontSize: '16px',
  lineHeight: 1.5,
  color: '#1d1c1a',
  margin: '0 0 6px',
  textAlign: 'left' as const,
  paddingLeft: '4px',
}
const lede = {
  fontSize: '16px',
  lineHeight: 1.55,
  color: '#1d1c1a',
  margin: '0 0 14px',
  textAlign: 'left' as const,
}
const btn = {
  backgroundColor: '#1d1c1a',
  color: '#ffffff',
  padding: '14px 24px',
  borderRadius: '9999px',
  fontSize: '15px',
  fontWeight: 700,
  textDecoration: 'none',
  display: 'inline-block',
}
const fallback = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: '#1d1c1a',
  opacity: 0.7,
  margin: '0 0 28px',
  wordBreak: 'break-all' as const,
}
const link = {
  color: '#1d1c1a',
  textDecoration: 'underline',
}
const sig = {
  fontSize: '12px',
  color: '#1d1c1a',
  opacity: 0.6,
  margin: 0,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}
