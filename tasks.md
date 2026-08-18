# MoodBox Bloom — Implementation Tasks

## Phase 1: Foundation (Days 1–2)
- [ ] Install dependencies (Prisma, Stripe, Zod, Resend, lucide-react, vitest, playwright)
- [ ] Rename product images (remove trailing spaces)
- [ ] Create `.env.example` template
- [ ] Set up Prisma schema (`prisma/schema.prisma`)
- [ ] Design system: Tailwind theme with MoodBox colors (`globals.css`)
- [ ] Create `middleware.ts` (CSP, security headers)
- [ ] Create `lib/` utilities (db, stripe, format, constants)
- [ ] Create `types/` TypeScript type definitions
- [ ] Create `data/products.ts` static product catalog
- [ ] Create `data/shipping.ts` shipping methods
- [ ] Create `schemas/` Zod validation schemas
- [ ] Layout components: Header, Footer, Nav, MobileNav
- [ ] UI primitives: Button, Input, Card, Badge, Checkbox, Loading

## Phase 2: Product Catalog (Days 2–3)
- [ ] Homepage with hero + featured products
- [ ] Product listing page (`/produkty`)
- [ ] Product detail pages (`/produkty/[slug]`)
- [ ] About page (`/o-nas`)
- [ ] Contact page (`/kontakt`)
- [ ] Terms page (`/obchodni-podminky`)
- [ ] Privacy policy page (`/ochrana-udaju`)
- [ ] Complaints page (`/reklamace`)

## Phase 3: Cart (Day 3)
- [ ] Cart context + localStorage persistence (`cart-provider.tsx`)
- [ ] Cart drawer (slide-out panel)
- [ ] Cart page (`/kosik`)
- [ ] Cart icon with badge in header
- [ ] Add to cart / remove / update quantity

## Phase 4: Checkout (Days 4–6)
- [ ] Multi-step checkout form with Zod validation
- [ ] Step 1: Contact info
- [ ] Step 2: Shipping method (Packeta Widget v6 integration)
- [ ] Step 3: Payment method selection
- [ ] Step 4: Review + age verification + consents
- [ ] Stripe Elements integration
- [ ] COD payment path
- [ ] `createOrder` Server Action
- [ ] Database: Prisma migrations + order creation

## Phase 5: Order Fulfillment (Days 6–7)
- [ ] Stripe webhook handler (`/api/webhooks/stripe`)
- [ ] Order confirmation page (`/objednavka/potvrzeni`)
- [ ] Order tracking page (`/objednavka/[id]`)
- [ ] Email notifications (Resend: confirmation, shipping)
- [ ] Packeta API client (`lib/packeta.ts`)

## Phase 6: Polish & Compliance (Days 7–8)
- [ ] Age gate modal on entry
- [ ] Cookie consent banner
- [ ] SEO: metadata, Open Graph, sitemap
- [ ] Responsive design pass (mobile-first)
- [ ] Animations & micro-interactions
- [ ] Performance optimization (image optimization)

## Phase 7: Testing & Launch (Days 8–10)
- [ ] Unit tests (Zod schemas, price calculations)
- [ ] Integration tests (server actions, webhooks)
- [ ] E2E tests (Playwright: full checkout flow)
- [ ] Build verification (`npm run build`)
- [ ] Production deployment prep
