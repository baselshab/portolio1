import styles from "./Marquee.module.scss";

export default function Marquee() {
  const items = [
    "Full-Stack Engineering",
    "Scalable Systems",
    "Clean Code",
    "Product Thinking",
    "High-Performance APIs",
    "Resilient Architecture",
  ];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {items.concat(items).map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  );
}
