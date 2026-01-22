import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.110.0/crypto/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            planType
        } = await req.json();

        const secret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
        const generated_signature = await hmacSha256(razorpay_order_id + "|" + razorpay_payment_id, secret);

        if (generated_signature === razorpay_signature) {
            // Signature is valid, update database

            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // Calculate 30 days from now for subscription expiry
            const subscriptionEndDate = new Date();
            subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

            // Update user profile or subscription table
            // Assuming 'profiles' table exists and has a 'tier' or 'plan' column.
            // Adjust this based on actual schema. I will assume a 'tier' column for now.
            const { error } = await supabase
                .from('profiles')
                .update({
                    tier: planType,
                    subscription_status: 'active',
                    subscription_end_date: subscriptionEndDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            return new Response(
                JSON.stringify({ success: true, message: "Payment verified and subscription updated" }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                },
            );
        } else {
            throw new Error('Invalid signature');
        }

    } catch (error: any) {
        console.error('Error in verify-razorpay-payment:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Verification failed',
                details: error
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        );
    }
});

async function hmacSha256(message: string, secret: string) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(message)
    );

    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
