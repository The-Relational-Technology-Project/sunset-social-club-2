import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Sunset Social Club'
const SENDER_DOMAIN = 'notify.sunsetsocialclub.org'
const FROM_DOMAIN = 'notify.sunsetsocialclub.org'

interface Body {
  type: 'signup' | 'idea' | 'contact'
  fields: Array<{ label: string; value: string }>
}

export const Route = createFileRoute('/api/public/notify-submission')({
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

        const type = String(body?.type ?? '').slice(0, 40)
        const fields = Array.isArray(body?.fields)
          ? body.fields.slice(0, 20).map((f) => ({
              label: String(f?.label ?? '').slice(0, 80),
              value: String(f?.value ?? '').slice(0, 4000),
            }))
          : []
        if (!type || fields.length === 0) {
          return Response.json({ error: 'type and fields required' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const template = TEMPLATES['admin-notification']
        const recipient = template.to!
        const messageId = crypto.randomUUID()

        // Get or create unsubscribe token for this recipient (required by Lovable email API)
        const normalizedEmail = recipient.toLowerCase()
        let unsubscribeToken: string
        const { data: existingToken, error: tokenLookupError } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', normalizedEmail)
          .maybeSingle()

        if (tokenLookupError) {
          console.error('Token lookup failed', tokenLookupError)
          return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
        }

        if (existingToken && !existingToken.used_at) {
          unsubscribeToken = existingToken.token
        } else {
          const bytes = new Uint8Array(32)
          crypto.getRandomValues(bytes)
          const newToken = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
          const { error: upsertError } = await supabase
            .from('email_unsubscribe_tokens')
            .upsert({ token: newToken, email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })
          if (upsertError) {
            console.error('Failed to create unsubscribe token', upsertError)
            return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
          }
          const { data: storedToken, error: reReadError } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalizedEmail)
            .maybeSingle()
          if (reReadError || !storedToken) {
            console.error('Failed to read back unsubscribe token', reReadError)
            return Response.json({ error: 'Failed to prepare email' }, { status: 500 })
          }
          unsubscribeToken = storedToken.token
        }

        const templateData = { type, fields }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const subject =
          typeof template.subject === 'function'
            ? template.subject(templateData)
            : template.subject

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'admin-notification',
          recipient_email: recipient,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text,
            purpose: 'transactional',
            label: 'admin-notification',
            idempotency_key: messageId,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })


        if (enqueueError) {
          console.error('Failed to enqueue notification', enqueueError)
          return Response.json({ error: 'Failed to enqueue' }, { status: 500 })
        }

        return Response.json({ success: true })
      },
    },
  },
})
