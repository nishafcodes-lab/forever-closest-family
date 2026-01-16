-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create group_photos table to store photo URLs for student groups
CREATE TABLE public.group_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.group_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view group photos
CREATE POLICY "Anyone can view group photos"
ON public.group_photos
FOR SELECT
USING (true);

-- Only admins can insert/update group photos
CREATE POLICY "Admins can insert group photos"
ON public.group_photos
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update group photos"
ON public.group_photos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default group entries
INSERT INTO public.group_photos (group_name) VALUES
  ('Late Lateefs'),
  ('Friend Squad'),
  ('Innocent Girls'),
  ('CS Army'),
  ('V Close Group');

-- Create storage bucket for group photos
INSERT INTO storage.buckets (id, name, public) VALUES ('group-photos', 'group-photos', true);

-- Storage policies for group photos
CREATE POLICY "Anyone can view group photos storage"
ON storage.objects
FOR SELECT
USING (bucket_id = 'group-photos');

CREATE POLICY "Admins can upload group photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'group-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update group photos storage"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'group-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete group photos storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'group-photos' AND public.has_role(auth.uid(), 'admin'));