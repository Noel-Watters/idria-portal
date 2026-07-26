import type { page } from "@/types/wiki";

import GeneralTemplate from "./templates/GeneralTemplate";
import RulesTemplate from "./templates/RulesTemplate";

type PageRendererProps = {
  page: page;
};

export default function PageRenderer({
  page,
}: PageRendererProps) {
  switch (page.template) {
    case "Rules":
      return (
        <RulesTemplate page={page} />
      );

    case "General":
    default:
      return (
        <GeneralTemplate page={page} />
      );
  }
}