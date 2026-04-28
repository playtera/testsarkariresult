/**
 * Sanity Bulk Patch Script — Backfill `author` field on all existing posts
 *
 * Run with:   node scripts/patch-author.mjs
 *
 * What it does:
 *   1. Fetches all published posts that have NO `author` field set
 *   2. Patches them with "SarkariResultCorner Editorial Team"
 *   3. Reports total patched count
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'f8rann2n',
  dataset: 'production',
  apiVersion: '2024-04-06',
  // Write token — needed for mutations
  token: 'skH2QC9P5SRxJDpIl01938HlLQnpSQNFH1DWusZYeCqWdA53mG5LECZ963QLrl0yQ9IdghaqvhCLLh3ei04syt2xrFhuw5pyLdyCOG7s1OZbYQycY9wMU4ZcXWymjxTcUiQuOsFaeD5GiqQgGeVJSjigMnCV1XVUAxx2sscDA7rwMFL29m6D',
  useCdn: false,
})

const DEFAULT_AUTHOR = 'SarkariResultCorner Editorial Team'

async function patchAllPostsWithAuthor() {
  console.log('🔍 Fetching posts without an author field...\n')

  // Fetch all published posts (not drafts) that have no author
  const posts = await client.fetch(
    `*[_type == "post" && !(_id in path('drafts.**')) && !defined(author)] {
      _id,
      title,
      "slug": slug.current
    }`
  )

  if (posts.length === 0) {
    console.log('✅ All posts already have an author field set. Nothing to do!')
    return
  }

  console.log(`📋 Found ${posts.length} posts without an author. Starting patch...\n`)

  // Process in batches of 50 to avoid rate limits
  const BATCH_SIZE = 50
  let patchedCount = 0
  let errorCount = 0

  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE)

    // Build a Sanity transaction for the whole batch
    const transaction = client.transaction()
    for (const post of batch) {
      transaction.patch(post._id, (patch) =>
        patch.setIfMissing({ author: DEFAULT_AUTHOR })
      )
    }

    try {
      await transaction.commit()
      patchedCount += batch.length
      console.log(`  ✓ Patched batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} posts (total: ${patchedCount}/${posts.length})`)
    } catch (err) {
      errorCount += batch.length
      console.error(`  ✗ Error on batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err.message)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Done! ${patchedCount} posts patched with author: "${DEFAULT_AUTHOR}"`)
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} posts failed to patch — check errors above`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

patchAllPostsWithAuthor().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
