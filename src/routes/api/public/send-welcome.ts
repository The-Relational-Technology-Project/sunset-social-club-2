import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { template as memberWelcomeTemplate, renderTokens } from '@/lib/email-templates/member-welcome'

const FROM = 'Sunset Social Club <notifications@sunsetsocialclub.org>'
const REPLY_TO = 'oursunsetsocialclub@gmail.com'

interface Body {
  email: string
  firstName?: string | null
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 255
}

export const Route = createFileRoute('/api/public/send-welcome')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const resendKey = process.env.RESEND_API_KEY
        const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!resendKey || !supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: 'Server config error' }, { status: 500 })
        }

        let body: Body
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const email = String(body?.email ?? '').trim().toLowerCase()
        const firstName = body?.firstName
          ? String(body.firstName).trim().slice(0, 100) || null
          : null
        if (!isValidEmail(email)) {
          return Response.json({ error: 'Invalid email' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Load editable template (fall back to defaults if row missing)
        const { data: tpl } = await supabase
          .from('email_templates')
          .select('subject, heading, body_markdown, cta_label, cta_url')
          .eq('slug', 'member-welcome')
          .maybeSingle()

        const subjectRaw = tpl?.subject ?? memberWelcomeTemplate.subject as string
        const subject = renderTokens(String(subjectRaw), firstName)

        const element = React.createElement(memberWelcomeTemplate.component, {
          firstName,
          heading: tpl?.heading,
          bodyText: tpl?.body_markdown,
          ctaLabel: tpl?.cta_label,
          ctaUrl: tpl?.cta_url,
        })
        const html = await render(element)
        const text = await render(element, { plainText: true })

        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: FROM,
              to: [email],
              reply_to: REPLY_TO,
              subject,
              html,
              text,
              tags: [{ name: 'template', value: 'member-welcome' }],
            }),
          })
          if (!res.ok) {
            const errBody = await res.text()
            console.error(`Resend send failed [${res.status}]: ${errBody}`)
            return Response.json({ error: 'Send failed', status: res.status, body: errBody }, { status: 502 })
          }
          const json = await res.json().catch(() => ({}))
          return Response.json({ success: true, id: (json as any)?.id ?? null })
        } catch (err) {
          console.error('Resend send exception', err)
          return Response.json({ error: 'Send failed' }, { status: 500 })
        }
      },
    },
  },
})
