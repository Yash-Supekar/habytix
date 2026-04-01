import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  { label: "Tenants Managed", value: 120 },
  { label: "Maintenance Requests", value: 350 },
  { label: "System Users", value: 40 },
  { label: "Role Dashboards", value: 3 },
];

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">

        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <h3 className="text-3xl font-bold text-indigo-600">
              {inView && <CountUp end={stat.value} duration={2} />}+
            </h3>

            <p className="text-gray-600 mt-2">
              {stat.label}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}