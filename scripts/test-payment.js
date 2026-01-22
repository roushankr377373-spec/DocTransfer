
const SC_URL = 'https://myrthifravcxvcqlptcp.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRoaWZyYXZjeHZjcWxwdGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjA2MDQsImV4cCI6MjA3OTg5NjYwNH0.IO3AawigN1Vm3U842gTiiIw9oMMBNl3z9XDYuUaPMEI';

async function testOrder() {
    console.log("Testing create-razorpay-order...");
    try {
        const response = await fetch(`${SC_URL}/functions/v1/create-razorpay-order`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planType: 'standard',
                userId: 'test_node_user'
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

testOrder();
