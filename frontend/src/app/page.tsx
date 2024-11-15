import Title from "~/components/common/Title";
import ReportCard from "~/components/reports/ReportCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center md:block">
      <section className="mb-6">
        <Title variant="h4" text="Reports"/>
        <p className="text-black">Your camp has grown +5% this month</p>
      </section>

      <section className="flex flex-col items-center md:justify-between md:flex-row md:flex-wrap gap-6">
        {[1, 2, 3].map((index) => (
          <ReportCard
            key={index}
            title="Number of Healthy Survivors"
            subTitle="Last 30 days"
            result={1205}
            balance={5}
          />
        ))}
      </section>
    </div>
  );
}
