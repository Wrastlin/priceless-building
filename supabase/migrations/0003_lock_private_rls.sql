-- SECURITY FIX: lock the private tables to server-only (service-role) access.
--
-- 0002 created these with "for all to authenticated using(true) with check(true)".
-- That let ANY signed-in Supabase user read/write them directly through the
-- public REST API (the anon key + their session), which meant:
--   - item_private: any logged-in user could read every item's COST, and
--   - staff_emails: any logged-in user could INSERT their own email into the
--     admin allowlist and self-promote to admin (privilege escalation).
--
-- Fix: drop those policies. RLS stays enabled (from 0002) with NO anon/
-- authenticated policy, so all direct API access is denied. The app reaches
-- both tables ONLY through the service-role client (lib/supabase/admin.ts),
-- whose key is server-only and never shipped to the browser. Writes are still
-- gated at the app layer by requireAdminSession().
--
-- Apply in the Supabase SQL editor or via the Management API. Idempotent.

drop policy if exists item_private_authenticated_all on public.item_private;
drop policy if exists staff_emails_authenticated_all on public.staff_emails;

-- (No replacement policies: RLS-enabled + zero policies = deny all for anon and
--  authenticated. Service-role bypasses RLS, which is the only intended path.)
