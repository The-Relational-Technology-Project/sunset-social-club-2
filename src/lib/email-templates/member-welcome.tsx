import React from 'react'
import {
  Body,
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
}

const MemberWelcome = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're now a member of Sunset Social Club</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={crest}>
          <Text style={crestLabel}>Sunset Social Club</Text>
        </Section>
        <Heading style={h1}>
          {firstName ? `Welcome, ${firstName}.` : 'Welcome.'}
        </Heading>
        <Text style={lede}>
          You're now a member of Sunset Social Club! Stay tuned for updates.
        </Text>
        <Text style={sig}>Sunset, San Francisco</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: MemberWelcome,
  subject: "You're in — welcome to Sunset Social Club",
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
const lede = {
  fontSize: '16px',
  lineHeight: 1.55,
  color: '#1d1c1a',
  margin: '0 0 28px',
}
const sig = {
  fontSize: '12px',
  color: '#1d1c1a',
  opacity: 0.6,
  margin: 0,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}
