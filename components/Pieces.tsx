import { studies } from "@/lib/site";

export function Piece({ id, mode = "preview" }: { id: string; mode?: "preview" | "case" }) {
  const study = studies.find((item) => item.id === id);
  if (!study?.artwork) {
    return <div className="piece" aria-hidden="true" />;
  }

  const slides = study.gallery?.length ? study.gallery : [study.artwork];
  const showAll = mode === "case" || slides.length > 1;

  if (!showAll || slides.length === 1) {
    return (
      <div className={`piece piece--file piece--${study.cat} piece--${study.id}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={study.artwork} alt="" />
      </div>
    );
  }

  return (
    <div
      className={`piece piece--gallery piece--${study.cat} piece--${study.id}${mode === "case" ? " is-case" : ""}`}
      aria-hidden="true"
    >
      {slides.map((src) => (
        <figure className="piece-slide" key={src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </figure>
      ))}
    </div>
  );
}
