import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  type?: string
  fields?: Array<{ label: string; value: string }>
}

const AdminNotification = ({ type = 'submission', fields = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New {type} on Sunset Social Club</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New {type}</Heading>
        <Text style={intro}>Someone just submitted the form on sunsetsocialclub.org.</Text>
        <Hr style={hr} />
        <Section>
          {fields.map((f, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <Text style={label}>{f.label}</Text>
              <Text style={value}>{f.value || '(empty)'}</Text>
            </div>
          ))}
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Sunset Social Club</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminNotification,
  subject: (data: Record<string, any>) =>
    `New ${data?.type ?? 'submission'} — Sunset Social Club`,
  displayName: 'Admin submission notification',
  to: 'joshuanesbit@gmail.com',
  previewData: {
    type: 'contact message',
    fields: [
      { label: 'Name', value: 'Jane' },
      { label: 'Email', value: 'jane@example.com' },
      { label: 'Message', value: 'Hello!' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Nunito, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 800, color: '#000', margin: '0 0 8px' }
const intro = { fontSize: '15px', color: '#333', margin: '0' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const label = { fontSize: '12px', color: '#888', textTransform: 'uppercase' as const, margin: '0 0 2px', letterSpacing: '0.5px' }
const value = { fontSize: '15px', color: '#000', margin: 0, whiteSpace: 'pre-wrap' as const }
const footer = { fontSize: '12px', color: '#888', margin: 0 }
