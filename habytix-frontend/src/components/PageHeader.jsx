import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
