
interface StatCounterItemProps {
  number: string;
  label: string;
}

const StatCounterItem = ({ number, label }: StatCounterItemProps) => (
  <div>
    <p className="text-3xl md:text-4xl font-bold mb-2">{number}</p>
    <p className="text-sm md:text-base">{label}</p>
  </div>
);

const StatsCounter = () => {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCounterItem number="1200+" label="Students" />
          <StatCounterItem number="50+" label="Faculty Members" />
          <StatCounterItem number="35+" label="Years of Excellence" />
          <StatCounterItem number="85%" label="Placement Rate" />
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
