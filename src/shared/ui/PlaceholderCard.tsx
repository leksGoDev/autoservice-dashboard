type PlaceholderCardProps = {
  title: string;
  text: string;
};

export function PlaceholderCard({ title, text }: PlaceholderCardProps) {
  return (
    <article className="page-placeholder__card">
      <h2 className="page-placeholder__card-title">{title}</h2>
      <p className="page-placeholder__card-text">{text}</p>
    </article>
  );
}
