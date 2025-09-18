-- Clean up existing test data
DELETE FROM public.organization_members;
DELETE FROM public.profiles;
DELETE FROM public.organizations;

-- Clean up auth users (this will cascade to profiles via foreign key)
DELETE FROM auth.users WHERE email = 'soyoswelm@gmail.com';