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
        let currency = "INR";

        // Convert USD prices to INR (approximate rate 1 USD = 83 INR)
        // This ensures compatibility with most Razorpay accounts which are based in India
        if (planType === 'standard') {
            amount = 19 * 83 * 100; // ₹1,577.00
        } else if (planType === 'business') {
            amount = 29 * 83 * 100; // ₹2,407.00
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
            currency: currency,
            receipt: receiptId,
            notes: {
                userId: userId,
                planType: planType
            }
        };

        console.log('Creating Razorpay order with options:', JSON.stringify(options));

        const order = await instance.orders.create(options);

        return new Response(
            JSON.stringify(order),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        );

    } catch (error: any) {
        console.error('Error in create-razorpay-order:', error);

        let errorMessage = 'An internal server error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
                stack: error.stack,
                details: error
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});
