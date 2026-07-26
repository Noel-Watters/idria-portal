import type { page } from "@/types/wiki";

import PageRender from "@/components/editor/PageRender";
import BaseWikiTemplate from "./BaseTemplate";

type GeneralTemplateProps = {
  page: page;
};

export default function GeneralTemplate({
  page,
}: GeneralTemplateProps) {
  return (
    <BaseWikiTemplate title={page.title}>
      <PageRender content={page.content} />
    </BaseWikiTemplate>
  );
}