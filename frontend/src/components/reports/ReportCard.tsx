import Badge from "../common/Badge";
import Card from "../common/Card";
import Title from "../common/Title";

interface IReportCard {
  title: string,
  result: string | number,
  subTitle: string,
  balance?: number;
  key?: string | number;
}

export default function ReportCard({ title, result, subTitle, balance, ...rest }: IReportCard) {
  const hasPositiveBalance = balance && balance > 0;

  return (
    <Card {...rest}>
      <div className="max-w-[260px] w-screen md:max-w-[340px] md:w-[340px]">
        <div className="p-3 sm:p-4">
          <Title variant="h6" text={title} />

          <div className="flex items-center mt-4 gap-2">
            <Title variant="h3" text={result} />

            {Boolean(balance) &&
              <Badge
                text={`${hasPositiveBalance ? '+' : '-' } ${balance}`}
                color={hasPositiveBalance ? 'green' : 'red'}
              />
            }
          </div>

          <p className="font-xs text-black font-thin">{subTitle}</p>
        </div>

        <hr className="static left-0" />

        <div className="p-3 sm:p-4">
          Download report
        </div>
      </div>
    </Card>
  );
}