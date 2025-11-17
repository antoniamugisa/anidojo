-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create anime_entries table
CREATE TABLE IF NOT EXISTS public.anime_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_english TEXT,
  title_japanese TEXT,
  image TEXT,
  type TEXT,
  episodes INTEGER,
  status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch')),
  episodes_watched INTEGER DEFAULT 0 NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  start_date DATE,
  finish_date DATE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT false NOT NULL,
  rewatch_count INTEGER DEFAULT 0 NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  genres TEXT[] DEFAULT '{}',
  year INTEGER,
  rating TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, anime_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  story_rating INTEGER CHECK (story_rating >= 1 AND story_rating <= 10),
  animation_rating INTEGER CHECK (animation_rating >= 1 AND animation_rating <= 10),
  sound_rating INTEGER CHECK (sound_rating >= 1 AND sound_rating <= 10),
  character_rating INTEGER CHECK (character_rating >= 1 AND character_rating <= 10),
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 10),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  spoilers BOOLEAN DEFAULT false NOT NULL,
  watch_status TEXT NOT NULL CHECK (watch_status IN ('completed', 'watching', 'dropped', 'plan-to-watch')),
  episodes_watched INTEGER,
  tags TEXT[] DEFAULT '{}',
  pros TEXT,
  cons TEXT,
  recommendation TEXT CHECK (recommendation IN ('highly-recommend', 'recommend', 'mixed', 'not-recommend', 'strongly-not-recommend')),
  status TEXT DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published')),
  helpful_votes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create review_votes table
CREATE TABLE IF NOT EXISTS public.review_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(review_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Create comment_votes table
CREATE TABLE IF NOT EXISTS public.comment_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  upvote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create custom_lists table
CREATE TABLE IF NOT EXISTS public.custom_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create custom_list_entries table
CREATE TABLE IF NOT EXISTS public.custom_list_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.custom_lists(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(list_id, anime_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_anime_entries_user_id ON public.anime_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_anime_entries_anime_id ON public.anime_entries(anime_id);
CREATE INDEX IF NOT EXISTS idx_anime_entries_status ON public.anime_entries(status);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_anime_id ON public.reviews(anime_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- Create partial unique index for published reviews (one published review per user per anime)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_anime_published 
ON public.reviews(user_id, anime_id) 
WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON public.review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user_id ON public.review_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_review_id ON public.comments(review_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON public.comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user_id ON public.custom_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_list_entries_list_id ON public.custom_list_entries(list_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_list_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for anime_entries
CREATE POLICY "Users can view their own anime entries"
  ON public.anime_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anime entries"
  ON public.anime_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anime entries"
  ON public.anime_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own anime entries"
  ON public.anime_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view published reviews"
  ON public.reviews FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for review_votes
CREATE POLICY "Anyone can view review votes"
  ON public.review_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own votes"
  ON public.review_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.review_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.review_votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view non-deleted comments"
  ON public.comments FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comment_votes
CREATE POLICY "Anyone can view comment votes"
  ON public.comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own votes"
  ON public.comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.comment_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.comment_votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for custom_lists
CREATE POLICY "Users can view public lists or their own lists"
  ON public.custom_lists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists"
  ON public.custom_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON public.custom_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON public.custom_lists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for custom_list_entries
CREATE POLICY "Users can view entries for public lists or their own lists"
  ON public.custom_list_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_lists
      WHERE custom_lists.id = custom_list_entries.list_id
      AND (custom_lists.is_public = true OR custom_lists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert entries to their own lists"
  ON public.custom_list_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.custom_lists
      WHERE custom_lists.id = custom_list_entries.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entries from their own lists"
  ON public.custom_list_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_lists
      WHERE custom_lists.id = custom_list_entries.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_anime_entries_updated_at
  BEFORE UPDATE ON public.anime_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_custom_lists_updated_at
  BEFORE UPDATE ON public.custom_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update helpful_votes count
CREATE OR REPLACE FUNCTION public.update_review_helpful_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.reviews
  SET helpful_votes = (
    SELECT COUNT(*) FILTER (WHERE helpful = true) - COUNT(*) FILTER (WHERE helpful = false)
    FROM public.review_votes
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update helpful_votes
CREATE TRIGGER update_review_helpful_votes_on_insert
  AFTER INSERT ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_votes();

CREATE TRIGGER update_review_helpful_votes_on_update
  AFTER UPDATE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_votes();

CREATE TRIGGER update_review_helpful_votes_on_delete
  AFTER DELETE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_votes();

