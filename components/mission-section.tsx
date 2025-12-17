export default function MissionSection() {
  return (
    <section className="py-16 sm:py-24 bg-white" aria-labelledby="mission-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 id="mission-heading" className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-6">
            Our Mission
          </h2>
        </div>

        {/* Mission Statement */}
        <div className="space-y-6 text-center">
          <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
            At Ubuchi, we believe wellness isn't a luxury. It's a return to self.
          </p>

          <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
            Our mission is to craft teas that honor both body and spirit, supporting hormonal balance, deep vitality,
            and a grounded sense of calm. Rooted in respect for the body's natural rhythms, each blend is created with
            intention and integrity.
          </p>

          <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
            Guided by sustainability, we partner with growers who nurture the land, protect biodiversity, and uphold
            time-honored cultivation practices. Our aim is not just to offer tea, but to create a space that restores,
            nourishes, and reconnects you to both yourself and the natural world.
          </p>
        </div>
      </div>
    </section>
  )
}

