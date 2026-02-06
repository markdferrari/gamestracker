# Specs

## Feat: Improved filters

Additional filters - genre, developer/studio

## Feat: improved UI

### Goals
- Modern, minimal visual style with consistent typography and spacing
- Reduce visual noise on the homepage while keeping key actions obvious
- Improve mobile usability (touch-first layout, readable cards, simplified chrome)
- Make filters and view toggles feel “app-like” rather than utility controls

### Visual System
- **Typography**: Use Geist across the site (headings + body). Use 2–3 weights max.
- **Color**: Maintain light/dark parity and contrast; keep current teal/sky accent for CTAs/badges.
- **Elevation**: Subtle shadow or border for cards; avoid heavy gradients except for hero background.
- **Spacing**: Adopt a consistent spacing scale (4/8/12/16/24/32).

### Header + Branding
- Remove the current logo.
- Replace with a clean text-based title using a stronger font weight and tracking.
- Keep header height compact on mobile (no double-row headers).

### Homepage Layout
- Remove or simplify the main subtitle(s) to reduce clutter.
- The two sidebars should never appear on mobile; the main grid and filters should be the focus.
- On desktop, maintain the current two-sidebar layout but reduce visual density in sidebars.

### Filters + View Toggle
- Keep filters sticky on desktop (optional on mobile).
- Switch the light/dark toggle from text to icons (sun/moon).
- Ensure filter controls are thumb-friendly on mobile (larger tap targets, simplified labels).

### Carousel UI (Latest Reviews + Trending)
- **Mobile**: horizontal, left-to-right scrolling cards (touch swipe).
- **Desktop**: horizontal, left-to-right scrolling cards (consistent with mobile).
- **Card content parity**: Trending should show the same core fields as Latest Reviews:
  - Score (rounded)
  - Tier badge (if available)
  - Percent recommended on hover (hide if missing)
  - Cover image + title
  - Platform + release date
- Hover states should be subtle and consistent (opacity + small translate).

### Accessibility
- Maintain readable contrast in both themes.
- Buttons/links must have visible focus states.
- Ensure carousel items remain keyboard accessible.

### UI Package Recommendations
**Preferred stack:** shadcn/ui (Radix UI primitives + Tailwind styling)

**Component mapping**
- **Header**: `Button`, `DropdownMenu`, `Separator`, `Tooltip`
- **Filters / View Toggle**: `Select`, `Tabs` or `ToggleGroup`, `Badge`, `Button`
- **Cards + Carousels**: `Card`, `Badge`, `Skeleton`, optional `HoverCard`
- **Sidebars**: `ScrollArea`, `Separator`
- **Mobile filters** (optional): `Dialog` or `Sheet`

**Phased adoption**
- **Phase 1**: `Button`, `Badge`, `Card`, `Select`, `Tabs`, `Skeleton`
- **Phase 2**: `ScrollArea`, `HoverCard`, `Tooltip`, `DropdownMenu`
- **Phase 3**: `Dialog`/`Sheet` for mobile filter UX

### Phase 1 Implementation Status ✅

**Completed**
- ✅ Installed shadcn/ui and Radix UI primitives
- ✅ Added Phase 1 components: Button, Badge, Card, Select, Tabs, Skeleton
- ✅ Created `/components/ui` directory with all component files
- ✅ Set up utils file with `cn()` helper for className merging
- ✅ Configured components.json for shadcn integration
- ✅ Added CSS variables for light/dark theme to globals.css
- ✅ Installed all required dependencies (@radix-ui/react-select, @radix-ui/react-tabs, clsx, class-variance-authority, tailwind-merge)
- ✅ Build passes successfully

**Next Steps (Phase 2+)**
- Update Header component to use new Button (icon buttons for theme toggle)
- Refactor PlatformFilter to use Select and Tabs components
- Update GameCard to use new Card component
- Update carousel loading states to use Skeleton component
- Add Phase 2 components (ScrollArea, HoverCard, Tooltip, DropdownMenu)

### Open Questions
1. **Header layout**: Should the site title be left-aligned with controls on the right, or centered?

## Feat: Opencritic links

Integrate with the opencritic api - https://app.swaggerhub.com/apis-docs/OpenCritic/OpenCritic-API/1.0.0
Link to opencritic from game detail page

## Feat: 'Trending' ✅

### Overview
Display recently released games in a vertically scrolling carousel on the right sidebar of the homepage, helping users discover trending games that have been released recently.

### Data Source
- **API Endpoint**: OpenCritic `/game/recently-released`
- **Authentication**: Uses `RAPID_API_KEY` environment variable
- **Base URL**: `https://opencritic-api.p.rapidapi.com/`
- **Image Source**: IGDB covers via game name search (fallback to OpenCritic images)

### Display Specifications

#### Layout
- Right sidebar vertical carousel with auto-scrolling
- Fixed width (320px) on desktop, hidden on mobile
- Sticky positioning for persistent visibility
- Auto-scrolls every 3 seconds, pauses on hover
- Seamless infinite loop

#### Content Per Card
- Game cover art (IGDB cover, 64x85px)
- Game title (2-line clamp)
- Release date (formatted)
- Platform badge(s) (e.g., "PlayStation 5", "PC")
- Hover state: Shows review score if available
- Click action: Opens OpenCritic game page in new tab (or game detail page)

#### Behavior
- Shows 10 games initially (configurable)
- Next.js built-in caching (24 hour revalidate)
- Skeleton loaders during fetch (Suspense boundary)
- Error state: Shows empty state message
- Auto-scrolling with smooth transitions

### Technical Requirements

#### API Integration
```typescript
interface TrendingGame {
  id: number;
  name: string;
  images: {
    box?: { sm?: string; og?: string };
    banner?: { sm?: string; og?: string };
  };
  platforms?: Array<{ id: number; name: string }>;
  releaseDate?: string;
  topCriticScore?: number;
  numReviews?: number;
  percentRecommended?: number;
  igdbCoverUrl?: string; // IGDB cover via game name search
}
```

#### Component Structure
- `TrendingSection` - Server component container (similar to LatestReviewsSection)
- `TrendingCarousel` - Client component for auto-scrolling (similar to ReviewCarousel)
- API service method in `/lib/opencritic.ts` - `getRecentlyReleased(limit?)`
- Reuse IGDB search integration from `/lib/igdb.ts`

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
- ARIA labels for release dates and platforms
- Keyboard navigation via links
- Screen reader friendly
- Proper alt text for images
- External link indicators (opens in new tab)

#### Empty States
- If no games: Shows "No games available" with a suitable icon
- If API fails: Gracefully shows empty state
- Error logging for debugging

### Implementation Status
⏳ Planning phase
- [ ] API service method (`getRecentlyReleased`)
- [ ] TrendingSection server component
- [ ] TrendingCarousel client component
- [ ] IGDB image integration
- [ ] Component tests
- [ ] Error handling
- [ ] Homepage layout integration

### Future Enhancements
- Filter by platform or genre
- Sort by score or release date
- User preference for scroll speed
- Integration with user's tracked games

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