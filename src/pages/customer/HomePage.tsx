import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { Button } from '@/components/ui/Button'

/**
 * HomePage — Customer Landing Page
 * Full implementation coming in the next phase.
 * This skeleton establishes the route and visual shell.
 */
export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative flex flex-col md:flex-row items-stretch"
        style={{
          backgroundColor: 'var(--color-bg-muted)',
          borderBottom: '1px solid var(--color-border)',
          minHeight: '500px',
        }}
      >
        <Container className="w-full md:w-1/2 py-12 md:py-16 z-10 flex items-center">
          <div className="flex flex-col gap-6 md:pr-8">
            {/* Eyebrow */}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-xs)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-muted)',
              }}
            >
              ✦ &nbsp; Authentic Indian Craft
            </span>

            <h1 className="text-display" style={{ color: 'var(--color-text-base)' }}>
              Where Every
              <br />
              <em style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>
                Craft Tells
              </em>
              <br />
              a Story
            </h1>

            <p className="text-lead" style={{ maxWidth: '480px' }}>
              Discover hand-crafted products made by skilled artisans across India.
              From Madhubani paintings to Banarasi silk — each piece carries generations
              of knowledge.
            </p>

            <div className="flex items-center gap-4 flex-wrap mt-2">
              <Button as="a" href="/products" size="lg">
                Explore Products
              </Button>
              <Link
                to="/artisans"
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-sm)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Meet the Artisans <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>

        {/* Hero image - absolutely positioned on desktop to fill right half perfectly */}
        <div className="w-full md:absolute md:top-0 md:right-0 md:w-1/2 md:h-full">
          <ImagePlaceholder
            src="/images/hero-artisan.jpg"
            alt="Featured artisan at work"
            className="w-full h-full object-cover rounded-none"
            label="Hero Artisan Image"
          />
        </div>
      </section>

      {/* Craft Categories teaser */}
      <section className="section px-0">
        <Container>
          <SectionHeading
            title="Crafts from Every Corner of India"
            subtitle="Each category represents centuries of heritage passed down through generations of dedicated craftspeople."
            className="mb-12"
          />
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
          <ImagePlaceholder
            src="/images/craft-pottery.jpg"
            alt="Traditional Indian Pottery"
            aspectRatio="16/9"
            className="w-full h-full object-cover rounded-none border-[6px] border-maroon-800"
            label="Craft: Pottery"
          />
          <ImagePlaceholder
            src="/images/craft-textile.jpg"
            alt="Handwoven Indian Textiles"
            aspectRatio="16/9"
            className="w-full h-full object-cover rounded-none border-[6px] border-maroon-800"
            label="Craft: Textiles"
          />
        </div>

        <Container>
          <div className="flex justify-center mt-10">
            <Button as="a" href="/products" variant="outline">
              View All Products
            </Button>
          </div>
        </Container>
      </section>

      {/* Artisan feature teaser */}
      <section
        className="section"
        style={{ backgroundColor: 'var(--color-bg-muted)' }}
      >
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <ImagePlaceholder
                src="/images/artisan-1.jpg"
                alt="Artisan One"
                aspectRatio="3/4"
                className="rounded-none"
                label="Artisan Portrait 1"
              />
              <ImagePlaceholder
                src="/images/artisan-2.jpg"
                alt="Artisan Two"
                aspectRatio="3/4"
                className="mt-8 rounded-none"
                label="Artisan Portrait 2"
              />
            </div>

            <div className="flex flex-col gap-5">
              <SectionHeading
                title="Makers Behind the Craft"
                subtitle="Every product you see is a chapter from an artisan's life story. We believe the person is as important as the product."
                align="left"
              />
              <Button as="a" href="/artisans" variant="outline" size="lg">
                Discover Artisans
              </Button>
            </div>
          </div>
        </Container>
      </section>
      {/* Image Attributions */}
      <section className="py-8 border-t" style={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}>
        <Container>
          <div className="flex flex-col gap-2 text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
            <p className="font-semibold uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Image Credits (Wikimedia Commons, CC BY-SA 4.0)</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 opacity-80 mt-1">
              <li>Hero Image: Copper Pitcher Manufacturer by Volo817</li>
              <li>Textile Craft: Weaver at Lachen by Jirah P Lepcha</li>
              <li>Pottery Craft: Traditional Potter by Lens Cycle7</li>
              <li>Artisan 1: Chanderi Craft Weaver by Shoot stufz</li>
              <li>Artisan 2: Ashish Kansara by AshishKansaraMadhapar</li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  )
}
