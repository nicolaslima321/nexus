"use client";

import { Badge } from "~/components";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from 'axios';
import ReportCard from "~/components/reports/ReportCard";
import Title from "~/components/common/Title";

interface IReports {
  title: string;
  subTitle: string;
  result: number;
  balance: number;
};

interface IGeneratedReports {
  itemsPerSurvivorReport: {
    averageQuantityPerSurvivor: number;
    itemName: string;
    itemId: number;
  }[],
  statisticsAboutSurvivors: {
    healthyGrowthPercent: number;
    infectedGrowthPercent: number;
    recentlyHealthy: number;
    recentlyInfected: number;
    totalOfHealthySurvivors: number;
    totalOfInfectedSurvivors: number;
    totalSurvivors: number;
  }
};

export default function Home() {
  const [generatedReport, setGeneratedReport] = useState<IGeneratedReports>(null);

  const balanceOfCampGrown = useMemo(() => {
    if (!generatedReport) return 0;

    const { statisticsAboutSurvivors: { recentlyHealthy, recentlyInfected, totalSurvivors } } =
      generatedReport;

    const balanceOfTotalGrowth =
      (recentlyHealthy + recentlyInfected) / totalSurvivors;

    return balanceOfTotalGrowth * 100;
  }, [generatedReport]);

  const reportsToRender = useMemo(() => {
    let listOfReports;

    if (!generatedReport) return [];

    const { itemsPerSurvivorReport, statisticsAboutSurvivors } = generatedReport;

    const averageItemsReport = itemsPerSurvivorReport.map(({ averageQuantityPerSurvivor, itemName }) => ({
      title: 'Average Resource Allocation',
      subTitle: 'Per survivor',
      result: `${averageQuantityPerSurvivor} ${itemName}`,
      balance: 0,
    }));

    listOfReports = [{
      title: 'Number of Healthy Survivors',
      subTitle: 'Last 30 days',
      result: statisticsAboutSurvivors.totalOfHealthySurvivors,
      balance: statisticsAboutSurvivors.healthyGrowthPercent,
    }, {
      title: 'Number of Infected Survivors',
      subTitle: 'Last 30 days',
      result: statisticsAboutSurvivors.totalOfInfectedSurvivors,
      balance: statisticsAboutSurvivors.infectedGrowthPercent,
    }, ...averageItemsReport];

    return listOfReports;
  }, [generatedReport]);

  const getReports = useCallback(async () => {
    const { data: reportData } = await axios.get('/api/survivor/reports');

    setGeneratedReport(reportData);;
  }, []);

  useEffect(() => {
    getReports()
  }, []);

  return (
    <div className="flex flex-col">
      <section className="self-center md:self-start mb-6">
        <Title variant="h4" text="Reports"/>
        <p className="text-gray-700 dark:text-gray-400">Your camp has grown <Badge color={balanceOfCampGrown > 0 ? 'green' : 'red'} text={`${Math.round(balanceOfCampGrown)}%`} /> this month</p>
      </section>

      <section className="flex flex-col items-center md:justify-between md:flex-row md:flex-wrap gap-6">
        {reportsToRender.map(({ title, subTitle, result, balance }, index) => (
          <ReportCard
            key={index}
            title={title}
            subTitle={subTitle}
            result={result}
            balance={balance}
          />
        ))}
      </section>
    </div>
  );
}
