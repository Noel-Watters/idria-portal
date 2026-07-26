import type { page } from "@/types/wiki";

import PageRender from "@/components/editor/PageRender";
import BaseWikiTemplate from "./BaseTemplate";

type RulesTemplateProps = {
  page: page;
};

export default function RulesTemplate({
  page,
}: RulesTemplateProps) {
  return (
    <BaseWikiTemplate
      title={page.title}
      titleImage={{
        src: "/RulesLettering.png",
        alt: "Idria Rules",
        width: 400,
        height: 120,
      }}
    >
      <PageRender content={page.content} />
    </BaseWikiTemplate>
  );
}