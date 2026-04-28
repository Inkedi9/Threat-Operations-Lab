import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="panel rounded-[2rem] p-8 text-center">
      <div className="label-caps text-gold">Route not found</div>
      <h2 className="mt-3 text-4xl font-black text-ivory">Nothing mapped here yet</h2>
      <p className="mt-4 text-sm leading-8 text-muted">This route is outside the current phase 3 scope. Head back to the intelligence surface.</p>
      <Link to="/" className="mt-6 inline-flex rounded-[1.2rem] border border-gold/18 bg-gold/10 px-5 py-3 text-sm text-gold-soft hover:border-gold/28">
        Return to overview
      </Link>
    </section>
  );
}
