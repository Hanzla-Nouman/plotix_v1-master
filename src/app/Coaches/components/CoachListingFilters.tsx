import { CoachCategory } from "@/TSChema";
import CategoryIcon from "@/components/CategoryIcon";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import prepareDataForMapping from "@/helpers/prepareDataForMapping";
import { trpc } from "@/trpc/client";
import { ListFilter } from "lucide-react";
import React from "react";

export default function CoachListingFilters() {
  const { data: queryResults, isLoading } = trpc.category.getCategoriesList.useQuery({});

  const categories = queryResults || [];
  const categoriesToMap: (CoachCategory | null)[] = prepareDataForMapping( {data: categories, isLoading, take: 5} )

  return (
    <MaxWidthWrapper className="mt-24 flex gap-8">
      <Button variant="outline" size="sm" className="flex gap-2 rounded-full hover:text-primary">
        <ListFilter width={20} height={20} />
        Filters
      </Button>

      <div className="flex gap-4 sm:gap-6 max-w-max overflow-x-auto lg:max-w-full">
        <Button variant="ghost" className="text-primary hover:text-primary">All</Button>

        <div className="flex gap-2 items-center">
          {categoriesToMap.map((category, i) => category ? (
            <Button variant="ghost" className="flex items-center gap-2 px-2 w-max hover:text-primary" key={category.name}>
              <CategoryIcon name={category.name} />
             
              <p className="text-muted-foreground hover:text-primary">{category.name}</p>
            </Button>
          ): <div key={i} className="w-24 h-8 bg-slate-100 rounded-2" />)}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}