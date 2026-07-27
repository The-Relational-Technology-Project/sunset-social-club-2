import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
  token?: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
  token,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Sign in to {siteName}</Heading>
        <Text style={text}>
          Click the button below to sign in. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Sign In
        </Button>
        {token ? (
          <>
            <Text style={orText}>Or enter this 8-digit code:</Text>
            <Text style={codeStyle}>{token}</Text>
          </>
        ) : null}
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Nunito, Helvetica, Arial, sans-serif', color: '#1d1c1a' }
const container = { padding: '32px 28px', maxWidth: '520px', textAlign: 'center' as const }
const h1 = {
  fontSize: '26px',
  fontWeight: 800,
  fontStyle: 'italic' as const,
  color: '#1d1c1a',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#1d1c1a',
  lineHeight: '1.55',
  margin: '0 0 20px',
}
const orText = {
  fontSize: '13px',
  color: '#1d1c1a',
  opacity: 0.7,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '28px 0 8px',
}
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 800,
  letterSpacing: '8px',
  color: '#1d1c1a',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#1d1c1a',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  borderRadius: '9999px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#1d1c1a', opacity: 0.6, margin: '28px 0 0' }
