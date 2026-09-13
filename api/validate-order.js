/**
 * Validates a WooCommerce order number and returns the buyer's tier.
 * 
 * To connect to real WooCommerce:
 * 1. Add WC_CONSUMER_KEY and WC_CONSUMER_SECRET to Vercel env vars
 * 2. Replace the mock block below with the fetch call to your WC REST API
 * 
 * WooCommerce REST API endpoint:
 * GET https://jadejanosi.com/wp-json/wc/v3/orders/{order_id}
 * 
 * Fast Track product ID: set FAST_TRACK_PRODUCT_ID in env vars
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { orderNumber, email } = req.body

  if (!orderNumber || !email) {
    return res.status(400).json({ error: 'Missing order number or email' })
  }

  // ─── MOCK (remove when WooCommerce is connected) ──────────────────────────
  if (process.env.USE_MOCK_AUTH === 'true') {
    const mockOrders = {
      '1001': { valid: true, fastTrack: false, name: 'Demo User' },
      '1002': { valid: true, fastTrack: true, name: 'Fast Track User' },
    }
    const order = mockOrders[orderNumber]
    if (!order) return res.status(404).json({ error: 'Order not found' })
    return res.status(200).json(order)
  }
  // ─── END MOCK ─────────────────────────────────────────────────────────────

  // ─── REAL WOOCOMMERCE ─────────────────────────────────────────────────────
  try {
    const wcBase = 'https://jadejanosi.com/wp-json/wc/v3'
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64')

    const response = await fetch(`${wcBase}/orders/${orderNumber}`, {
      headers: { Authorization: `Basic ${auth}` },
    })

    if (!response.ok) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = await response.json()

    // Confirm email matches the order
    const orderEmail = order.billing?.email?.toLowerCase()
    if (orderEmail !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Email does not match this order' })
    }

    // Check if the Fast Track product is in the order
    const fastTrackProductId = parseInt(process.env.FAST_TRACK_PRODUCT_ID)
    const hasFastTrack = order.line_items?.some(
      item => item.product_id === fastTrackProductId || item.variation_id === fastTrackProductId
    )

    const name = order.billing?.first_name || 'there'

    return res.status(200).json({ valid: true, fastTrack: hasFastTrack, name })
  } catch (err) {
    return res.status(500).json({ error: 'Could not validate order' })
  }
  // ─── END WOOCOMMERCE ──────────────────────────────────────────────────────
}
