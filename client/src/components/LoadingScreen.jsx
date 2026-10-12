import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="loading-shell">
      <motion.div
        className="brand-loader"
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration:1.5, ease: 'easeOut' }}
      >
        <h2 className="loader-mark">L</h2>
        <div>
          <p>Live News</p>
          <span>Live desk</span>
        </div>
      </motion.div>

      <motion.div
        className="loading-bar"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </div>
  );
}
