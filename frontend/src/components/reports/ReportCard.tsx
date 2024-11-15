import Badge from "../common/Badge";
import Card from "../common/Card";
import Title from "../common/Title";
import { Divider } from'@mui/material';

interface IReportCard {
  title: string,
  result: string | number,
  subTitle: string,
  balance?: number;
  key?: string | number;
}

export default function ReportCard({ title, result, subTitle, balance, key }: IReportCard) {
  const hasPositiveBalance = balance && balance > 0;

  return (
    <Card key={key}>
      <>
        <Title variant="h6" text={title} />

        <div className="flex items-center gap-2">
          <Title variant="h3" text={result} />

          {Boolean(balance) &&
            <Badge
              text={`${hasPositiveBalance ? '+' : '-' } ${balance}`}
              color={hasPositiveBalance ? 'green' : 'red'}
            />
          }
        </div>

        <p className="font-xs text-black font-thin">{subTitle}</p>

        <hr />

        Download report
      </>
    </Card>
  );
}