import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-8xl md:text-9xl uppercase">404</h2>
      <h2 className="text-4xl md:text-6xl uppercase">Not Found</h2>
      <p className="text-lg md:text-2xl text-zinc-200/80">
        Could not find requested resource
      </p>
      <Link className="text-lg md:text-xl mt-10" href="/">
        &lt;&lt; Return Home &gt;&gt;
      </Link>
    </div>
  );
}
