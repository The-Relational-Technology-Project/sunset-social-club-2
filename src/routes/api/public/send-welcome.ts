import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Sunset Social Club'
const SENDER_DOMAIN = 'notify.sunsetsocialclub.org'
const FROM_DOMAIN = 'notify.sunsetsocialclub.org'

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
        const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
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
        const template = TEMPLATES['member-welcome']
        const messageId = crypto.randomUUID()

        // Suppression check
        const { data: suppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (suppressed) {
          return Response.json({ success: false, reason: 'email_suppressed' })
        }

        // Unsubscribe token
        let unsubscribeToken: string
        const { data: existingToken, error: tokenLookupError } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', email)
          .maybeSingle()
        if (tokenLookupError) {
          return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
        }
        if (existingToken && !existingToken.used_at) {
          unsubscribeToken = existingToken.token
        } else if (!existingToken) {
          const bytes = new Uint8Array(32)
          crypto.getRandomValues(bytes)
          const newToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
          const { error: upsertError } = await supabase
            .from('email_unsubscribe_tokens')
            .upsert({ token: newToken, email }, { onConflict: 'email', ignoreDuplicates: true })
          if (upsertError) {
            return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
          }
          const { data: storedToken } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', email)
            .maybeSingle()
          if (!storedToken) {
            return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
          }
          unsubscribeToken = storedToken.token
        } else {
          return Response.json({ success: false, reason: 'email_suppressed' })
        }

        const templateData = { firstName }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function'
            ? template.subject(templateData)
            : template.subject

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'member-welcome',
          recipient_email: email,
          status: 'pending',
        })

        // Idempotency: one welcome per email
        const idempotencyKey = `member-welcome:${email}`

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: email,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text,
            purpose: 'transactional',
            label: 'member-welcome',
            idempotency_key: idempotencyKey,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          return Response.json({ error: 'Failed to enqueue' }, { status: 500 })
        }
        return Response.json({ success: true })
      },
    },
  },
})
