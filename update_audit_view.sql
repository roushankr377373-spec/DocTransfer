-- Add user_agent to recent_audit_activity view
DROP VIEW IF EXISTS recent_audit_activity;

CREATE OR REPLACE VIEW recent_audit_activity AS
SELECT 
    ae.id,
    ae.event_type,
    ae.event_timestamp,
    d.name as document_name,
    d.id as document_id,
    ds.signer_name,
    ae.user_email,
    ae.ip_address,
    ae.user_agent, -- Added field
    ae.geolocation->>'city' as city,
    ae.geolocation->>'country' as country,
    ae.event_metadata
FROM audit_events ae
LEFT JOIN documents d ON ae.document_id = d.id
LEFT JOIN document_signers ds ON ae.signer_id = ds.id
ORDER BY ae.event_timestamp DESC;
