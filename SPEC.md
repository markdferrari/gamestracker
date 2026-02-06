# Specs

## Feat: Improved filters

Additional filters - genre, developer/studio

## Feat: Opencritic links

Integrate with the opencritic api - https://app.swaggerhub.com/apis-docs/OpenCritic/OpenCritic-API/1.0.0
Link to opencritic from game detail page

## Feat: 'Trending'

Carousel similar to latest reviews feature already implemented. 
Should use /game/recently-released endpoint using RAPID_API_KEY for auth
Should show 5-10 games in a scrolling carousel component on the homepage

## Feat: SEO metadata

I want to improve our ranking for search by including dynamic metadata on each page.

## Feat: 'Latest reviews' ✅

### Overview
Display recently reviewed games in a vertically scrolling carousel on the left sidebar of the homepage, helping users discover games that critics are currently discussing.

### Data Source
- **API Endpoint**: OpenCritic `/game/reviewed-this-week`
- **Authentication**: Uses `RAPID_API_KEY` environment variable
- **Base URL**: `https://opencritic-api.p.rapidapi.com/`
- **Image Source**: IGDB covers via game name search (fallback to OpenCritic images)

### Display Specifications

#### Layout
- Left sidebar vertical carousel with auto-scrolling
- Fixed width (320px) on desktop, hidden on mobile
- Sticky positioning for persistent visibility
- Auto-scrolls every 3 seconds, pauses on hover
- Seamless infinite loop

#### Content Per Card
- Game cover art (IGDB cover, 64x85px)
- Game title (2-line clamp)
- Review score (rounded to whole number)
- Tier badge (color-coded: Mighty/Strong/Fair/Weak)
- Hover state: Shows percent recommended
- Click action: Opens OpenCritic game page in new tab

#### Behavior
- Shows 10 games initially (configurable)
- Next.js built-in caching (24 hour revalidate)
- Skeleton loaders during fetch (Suspense boundary)
- Error state: Shows empty state message
- Auto-scrolling with smooth transitions

### Technical Requirements

#### API Integration
```typescript
interface OpenCriticReview {
  id: number;
  name: string;
  images: {
    box?: { sm?: string; og?: string };
    banner?: { sm?: string; og?: string };
  };
  tier?: string;
  topCriticScore?: number;
  numReviews: number;
  percentRecommended?: number;
  releaseDate?: string;
  igdbCoverUrl?: string; // IGDB cover via game name search
}
```

#### Component Structure
- `LatestReviewsSection` - Server component container
- `ReviewCarousel` - Client component for auto-scrolling
- `ReviewCard` - Deprecated (integrated into carousel)
- `BentoBox` - Deprecated (replaced with carousel)
- API service method in `/lib/opencritic.ts`
- IGDB search integration in `/lib/igdb.ts`

#### Caching Strategy
- Uses Next.js built-in fetch caching
- Cache duration: 24 hours (86400 seconds)
- Server-side revalidation
- No client-side caching library needed

#### Performance
- Lazy load images with Next.js Image component
- IGDB images proxied through `/api/image` route
- Optimized for Core Web Vitals
- Smooth CSS transitions for auto-scroll

### User Experience

#### Loading States
1. Initial load: Suspense boundary with skeleton UI
2. Progressive image loading
3. Smooth auto-scroll transitions

#### Accessibility
- Semantic HTML (`<aside>`, `<nav>`)
- ARIA labels for scores and tier badges
- Keyboard navigation via links
- Screen reader friendly
- Proper alt text for images
- External link indicators (opens in new tab)

#### Empty States
- If no reviews: Shows "No reviews available" with Trophy icon
- If API fails: Gracefully shows empty state
- Error logging for debugging

### Implementation Status
✅ Core feature complete
✅ Auto-scrolling carousel
✅ IGDB image integration
✅ Error handling
✅ Accessibility
✅ Tests (19 passing)
✅ Hover states with percent recommended

### Future Enhancements
- Filter by platform or genre
- Animation effects for card transitions
- User preference for scroll speed
- Integration with user's tracked games