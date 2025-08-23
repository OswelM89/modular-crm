/*
  # Validación de tablas principales

  Este script valida que todas las tablas, relaciones, índices y políticas
  estén correctamente configuradas en Supabase.

  1. Verificación de tablas
  2. Verificación de columnas y tipos
  3. Verificación de relaciones (Foreign Keys)
  4. Verificación de índices
  5. Verificación de triggers y funciones
  6. Verificación de políticas RLS
*/

-- ========================================
-- 1. VERIFICAR QUE EXISTEN LAS TABLAS
-- ========================================

SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'profiles', 'organization_members', 'super_admins')
ORDER BY tablename;

-- ========================================
-- 2. VERIFICAR ESTRUCTURA DE TABLAS
-- ========================================

-- Verificar columnas de organizations
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'organizations'
ORDER BY ordinal_position;

-- Verificar columnas de profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Verificar columnas de organization_members
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'organization_members'
ORDER BY ordinal_position;

-- Verificar columnas de super_admins
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'super_admins'
ORDER BY ordinal_position;

-- ========================================
-- 3. VERIFICAR FOREIGN KEYS
-- ========================================

SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('organizations', 'profiles', 'organization_members', 'super_admins')
ORDER BY tc.table_name, kcu.column_name;

-- ========================================
-- 4. VERIFICAR ÍNDICES
-- ========================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'profiles', 'organization_members', 'super_admins')
ORDER BY tablename, indexname;

-- ========================================
-- 5. VERIFICAR FUNCIONES
-- ========================================

SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('update_updated_at_column', 'set_organization_slug', 'handle_new_user')
ORDER BY routine_name;

-- ========================================
-- 6. VERIFICAR TRIGGERS
-- ========================================

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('organizations', 'profiles', 'organization_members', 'super_admins')
OR trigger_name IN ('on_auth_user_created')
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 7. VERIFICAR RLS (ROW LEVEL SECURITY)
-- ========================================

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'profiles', 'organization_members', 'super_admins');

-- ========================================
-- 8. VERIFICAR POLÍTICAS RLS
-- ========================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('organizations', 'profiles', 'organization_members', 'super_admins')
ORDER BY tablename, policyname;

-- ========================================
-- 9. VERIFICAR CONSTRAINTS
-- ========================================

SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('organizations', 'profiles', 'organization_members', 'super_admins')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ========================================
-- 10. VERIFICAR SECUENCIAS (para UUIDs)
-- ========================================

SELECT 
    sequence_name,
    data_type,
    numeric_precision,
    increment,
    minimum_value,
    maximum_value
FROM information_schema.sequences 
WHERE sequence_schema = 'public';

-- ========================================
-- RESUMEN DE VALIDACIÓN
-- ========================================

SELECT 
    'VALIDACIÓN COMPLETADA' as status,
    'Revisa los resultados anteriores para confirmar que todo esté correcto' as message;