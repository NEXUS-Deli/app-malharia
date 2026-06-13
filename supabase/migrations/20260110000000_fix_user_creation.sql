CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION admin_create_user(
  p_email text,
  p_password text,
  p_name text,
  p_role text DEFAULT 'visualizador'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_caller_company_id uuid;
  v_user_id uuid;
  v_result jsonb;
BEGIN
  v_caller_id := auth.uid();

  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  SELECT role, company_id INTO v_caller_role, v_caller_company_id
  FROM profiles WHERE id = v_caller_id;

  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'Perfil do usuário não encontrado';
  END IF;

  IF v_caller_role NOT IN ('super_admin', 'admin_empresa') THEN
    RAISE EXCEPTION 'Permissão negada. Apenas administradores podem criar usuários.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já cadastrado';
  END IF;

  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email é obrigatório';
  END IF;

  IF p_password IS NULL OR length(p_password) < 6 THEN
    RAISE EXCEPTION 'Senha deve ter no mínimo 6 caracteres';
  END IF;

  IF p_name IS NULL OR p_name = '' THEN
    RAISE EXCEPTION 'Nome é obrigatório';
  END IF;

  v_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    id, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, created_at, updated_at,
    is_sso_user, is_anonymous, instance_id
  ) VALUES (
    v_user_id,
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(), now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('name', p_name, 'role', p_role, 'company_id', v_caller_company_id::text),
    'authenticated', 'authenticated',
    now(), now(),
    false, false,
    '00000000-0000-0000-0000-000000000000'
  );

  v_result := jsonb_build_object(
    'id', v_user_id, 'email', p_email,
    'name', p_name, 'role', p_role,
    'company_id', v_caller_company_id
  );

  RETURN v_result;
END;
$$;
