-- Fix for "infinite recursion detected in policy for relation room_members"
-- This script drops problematic recursive policies and sets up a safe basic policy.

-- 1. Disable RLS temporarily to break the recursion loop immediately
ALTER TABLE room_members DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies on room_members to remove the recursive one
DROP POLICY IF EXISTS "Enable read access for room members" ON room_members;
DROP POLICY IF EXISTS "Enable insert for room members" ON room_members;
DROP POLICY IF EXISTS "Enable update for room members" ON room_members;
DROP POLICY IF EXISTS "Enable delete for room members" ON room_members;
DROP POLICY IF EXISTS "Public Read Access" ON room_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON room_members;
DROP POLICY IF EXISTS "Users can view members of their rooms" ON room_members;

-- 3. Create a SAFE, non-recursive policy
-- This assumes the table has a 'user_id' column. 
-- If it uses 'member_id', please change 'user_id' to 'member_id' below.

create policy "Users can view their own memberships"
on room_members for select
using ( user_id = auth.uid() );

create policy "Users can insert their own memberships"
on room_members for insert
with check ( user_id = auth.uid() );

-- 4. Re-enable RLS
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- 5. Notify
DO $$
BEGIN
    RAISE NOTICE 'Fixed infinite recursion by resetting room_members policies';
END $$;
