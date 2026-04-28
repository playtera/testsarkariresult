import { writeClient } from '@/lib/sanity/write-client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, htmlBody, category } = body;

    if (!title || !slug) {
      return Response.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    // Clean slug for Sanity
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    
    // Check if post already exists
    const query = `*[_type == "post" && slug.current == $slug][0]`;
    const existing = await writeClient.fetch(query, { slug: cleanSlug });

    const doc = {
      _type: 'post',
      title: title,
      slug: {
        _type: 'slug',
        current: cleanSlug,
      },
      htmlBody: htmlBody,
      status: 'published',
      publishedAt: new Date().toISOString(),
      tracking: {
        enabled: true,
        sourceSlug: cleanSlug,
      }
    };

    let result;
    if (existing) {
      // Update existing
      result = await writeClient.patch(existing._id).set(doc).commit();
    } else {
      // Create new
      result = await writeClient.create(doc);
    }

    return Response.json({ 
      success: true, 
      id: result._id, 
      action: existing ? 'updated' : 'created' 
    });
  } catch (error) {
    console.error('[API create-post] Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Failed to create post in Sanity' 
    }, { status: 500 });
  }
}
