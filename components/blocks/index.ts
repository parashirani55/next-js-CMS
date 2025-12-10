import SectionBlock from "./SectionBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { HtmlBlock } from "./HtmlBlock";

export const blockMap: any = {
  section: SectionBlock,
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  html: HtmlBlock,
};
