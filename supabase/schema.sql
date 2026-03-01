-- DreamVerse Supabase Schema
-- Open Source AI Music Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    credits INTEGER DEFAULT 100,  -- Free credits for testing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks table
CREATE TABLE public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    audio_url TEXT,
    duration INTEGER DEFAULT 30,
    status TEXT DEFAULT 'generating',  -- generating, completed, failed
    model_used TEXT DEFAULT 'musicgen-medium',
    credits_used INTEGER DEFAULT 10,
    is_public BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    plays_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User likes
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, track_id)
);

-- Comments
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public gallery
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    featured BOOLEAN DEFAULT FALSE,
    featured_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tracks_user_id ON public.tracks(user_id);
CREATE INDEX idx_tracks_status ON public.tracks(status);
CREATE INDEX idx_tracks_created_at ON public.tracks(created_at DESC);
CREATE INDEX idx_likes_track_id ON public.likes(track_id);
CREATE INDEX idx_comments_track_id ON public.comments(track_id);
CREATE INDEX idx_gallery_featured ON public.gallery(featured, featured_at DESC);

-- Row Level Security (RLS)

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update only own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Tracks: Read all, insert own, update/delete own
CREATE POLICY "Tracks are viewable by everyone"
    ON public.tracks FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own tracks"
    ON public.tracks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracks"
    ON public.tracks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracks"
    ON public.tracks FOR DELETE
    USING (auth.uid() = user_id);

-- Likes: Users can read all, create/delete own
CREATE POLICY "Likes are viewable by everyone"
    ON public.likes FOR SELECT
    USING (true);

CREATE POLICY "Users can like tracks"
    ON public.likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike tracks"
    ON public.likes FOR DELETE
    USING (auth.uid() = user_id);

-- Comments: Read all, create own, delete own
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (true);

CREATE POLICY "Users can comment"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- Gallery: Public read, admin only write
CREATE POLICY "Gallery is viewable by everyone"
    ON public.gallery FOR SELECT
    USING (true);

-- Functions

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update track count
CREATE OR REPLACE FUNCTION public.update_track_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET credits = credits - NEW.credits_used
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get public gallery
CREATE OR REPLACE FUNCTION public.get_public_tracks(limit_count INTEGER DEFAULT 50)
RETURNS SETOF public.tracks AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.tracks
    WHERE status = 'completed' AND is_public = true
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending tracks
CREATE OR REPLACE FUNCTION public.get_trending_tracks(limit_count INTEGER DEFAULT 50)
RETURNS SETOF public.tracks AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.tracks
    WHERE status = 'completed' AND is_public = true
    ORDER BY (likes_count * 2 + plays_count) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert sample presets
INSERT INTO public.tracks (user_id, title, prompt, audio_url, duration, status, is_public, likes_count, plays_count) VALUES
    -- Demo tracks would be inserted here
;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
