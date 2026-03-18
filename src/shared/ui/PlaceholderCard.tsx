import styles from "./PagePlaceholder.module.css";

type PlaceholderCardProps = {
  title: string;
  text: string;
};

export function PlaceholderCard({ title, text }: PlaceholderCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardText}>{text}</p>
    </article>
  );
}
