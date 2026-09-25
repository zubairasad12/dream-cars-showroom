'use client';

import React, { use, useState, useEffect } from 'react';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedParams?.id) setPostId(resolvedParams.id);
  }, [resolvedParams]);

  if (!postId) {
    return <div className="text-center py-20 text-[#A6A39C] text-xs">Loading article...</div>;
  }

  return <BlogPostForm postId={postId} />;
}
