import { motion } from 'framer-motion';

export default function EnergyRing() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Outer ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          top: -300,
          left: -300,
          borderRadius: '50%',
          border: '1px solid rgba(0, 245, 255, 0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00f5ff',
              top: '50%',
              left: '50%',
              boxShadow: '0 0 15px rgba(0, 245, 255, 0.8)',
              transformOrigin: '0 0',
              transform: `rotate(${deg}deg) translateX(300px) translateY(-4px)`,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }}
          />
        ))}
      </motion.div>

      {/* Middle ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          top: -210,
          left: -210,
          borderRadius: '50%',
          border: '1px solid rgba(255, 0, 229, 0.15)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <motion.div
            key={deg}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#ff00e5',
              top: '50%',
              left: '50%',
              boxShadow: '0 0 15px rgba(255, 0, 229, 0.8)',
              transformOrigin: '0 0',
              transform: `rotate(${deg}deg) translateX(210px) translateY(-3px)`,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: deg / 360 }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          top: -130,
          left: -130,
          borderRadius: '50%',
          border: '1px solid rgba(255, 215, 0, 0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 120, 240].map((deg) => (
          <motion.div
            key={deg}
            style={{
              position: 'absolute',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#ffd700',
              top: '50%',
              left: '50%',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
              transformOrigin: '0 0',
              transform: `rotate(${deg}deg) translateX(130px) translateY(-2.5px)`,
            }}
            animate={{ scale: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: deg / 360 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
