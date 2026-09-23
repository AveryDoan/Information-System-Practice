/** Photo banner + overlaid title, used at the top of browse/list screens — see src/lib/heroPhotos.ts. */
export function CategoryHero({ photo, title }: { photo: string; title: string }) {
  return (
    <div className="relative h-40 shrink-0 overflow-hidden">
      <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-teal/55" />
      <h1 className="heading absolute inset-x-5 bottom-4 text-3xl text-white">{title}</h1>
    </div>
  )
}
