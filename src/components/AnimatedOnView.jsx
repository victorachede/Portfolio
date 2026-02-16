import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  },
};

const AnimatedOnView = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      variants={animationVariants.fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ ...animationVariants.fadeInUp.visible.transition, delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedOnView;