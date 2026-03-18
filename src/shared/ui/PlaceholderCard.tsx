import styles from "./PagePlaceholder.module.css";

type PlaceholderCardProps = {
  title: string;
  text: string;
};

export function PlaceholderCard({ title, text }: PlaceholderCardProps) {
  return (
    <article className={`${styles.card} p-5`}>
      <h2 className="mb-2 text-base">{title}</h2>
      <p className="m-0 text-[var(--color-text-secondary)]">{text}</p>
    </article>
  );
}
