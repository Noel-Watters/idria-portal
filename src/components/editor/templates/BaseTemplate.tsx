import Image from "next/image";
import type { ReactNode } from "react";
import DevtNotice from "@/components/DevNotice";

type BaseWikiTemplateProps = {
  title: string;
  children: ReactNode;
  titleImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export default function BaseWikiTemplate({
  title,
  children,
  titleImage,
}: BaseWikiTemplateProps) {
  return (
    <main className="min-h-screen mx-4 md:mx-16">
      <div className="bg-surface-2 mx-auto my-8 max-w-7xl rounded-2xl px-4 py-12 md:px-16">
        {titleImage ? (
          <Image
            src={titleImage.src}
            alt={titleImage.alt}
            width={titleImage.width}
            height={titleImage.height}
            className="mx-auto h-auto w-auto py-6 object-contain"
            priority
          />
        ) : (
          <h1 className="text-4xl font-bold">
            {title}
          </h1>
        )}

        <DevtNotice />

        <div className="mt-8">
          {children}
        </div>
      </div>
    </main>
  );
}