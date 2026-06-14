/**
 * One-sentence brand pitch on a dark band. Sits between the
 * walkthrough explainer and the newsletter signup so the page rhythm
 * goes light explainer → dark statement → red call to action.
 */
export function BrandStatement() {
  return (
    <section className="bg-[#0b1220] text-white">
      <div
        className="mx-auto max-w-3xl px-6 py-12 text-center md:py-20"
        data-reveal
      >
        <p className="font-display text-3xl leading-tight md:text-5xl">
          Style and class at <span className="text-[#ff8b85]">every</span> price point.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
          We pride ourselves on being affordable to anyone looking to liven up their home, and we try to make the rest of it as easy as possible.
        </p>
      </div>
    </section>
  );
}
