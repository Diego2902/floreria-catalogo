export default function Spinner({ label = 'Cargando…' }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.dot} />
      <span style={styles.label}>{label}</span>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '40px 0',
    color: 'var(--color-ink-soft)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--color-accent)',
    animation: 'pulse 1s ease-in-out infinite',
  },
  label: {
    letterSpacing: '0.04em',
  },
}