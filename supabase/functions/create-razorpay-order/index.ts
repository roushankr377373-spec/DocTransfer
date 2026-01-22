import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { planType, userId } = await req.json();

        if (!planType || !userId) {
            throw new Error('Missing planType or userId');
        }

        let amount = 0;
        // Define prices in SMALLEST CURRENCY UNIT (paise for INR, cents for USD)
        // Assuming USD for now based on Pricing.tsx ($19 and $29).
        // Razorpay international payments might need specific setup or just use INR equivalent.
        // Let's stick to the visible price.
        // NOTE: Razorpay default currency is usually INR. Ensure your account supports USD or convert.
        // For simplicity, I will use USD.

        // Switching to INR to ensure compatibility with most Razorpay accounts
        if (planType === 'standard') {
            amount = 1900; // ₹19.00
        } else if (planType === 'business') {
            amount = 2900; // ₹29.00
        } else {
            throw new Error('Invalid plan type');
        }

        const key_id = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID') || '';
        const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

        if (!key_id || !key_secret) {
            throw new Error('Missing Razorpay API Keys in Server Environment');
        }

        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        // Razorpay receipt id must be <= 40 chars.
        // Format: rcpt_timestamp_last5UserId (approx 24 chars)
        const shortUserId = userId && userId.length > 5 ? userId.slice(-5) : (userId || 'anon');
        const receiptId = `rcpt_${Date.now()}_${shortUserId}`;

        const options = {
            amount: amount,
            currency: "USD",  // Changed to USD ($19/$29)
            receipt: receiptId,
            notes: {
                userId: userId,
                planType: planType
            }
        };

        const order = await instance.orders.create(options);

        return new Response(
            JSON.stringify(order),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error creating order:', error);
        const errorMessage = error.message || String(error) || 'Unknown error';
        return new Response(
            JSON.stringify({ error: errorMessage, details: error }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
