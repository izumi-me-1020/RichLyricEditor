import { HEADING, INLINE_CODE, PROSE } from "@/ui/help-sections/shared";
import { t } from "i18next";

// -- TTML Standards -----------------------------------------------------------

const TtmlStandardsSection: React.FC = () => (
  <div className="space-y-5">
    <h4 className={HEADING}>{t("What RichLyricEditor outputs")}</h4>
    <p className={PROSE}>
      {t("RichLyricEditor emits")}{" "}
      <a
        href="https://www.w3.org/TR/2018/REC-ttml1-20181108/"
        target="_blank"
        rel="noreferrer"
        className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
      >
        {t("TTML 1")}
      </a>{" "}
      {t(
        "with the standard structure: <tt> root with the TTML namespace, <head> with <ttm:title> and <ttm:agent> declarations, and <body><div><p> for lines with <span> per word for word-level timing.",
      )}
    </p>
    <p className={PROSE}>
      {t("Background vocals use")}{" "}
      <span className={INLINE_CODE}>ttm:role="x-bg"</span>
      {t(", which is the spec-sanctioned")}{" "}
      <span className={INLINE_CODE}>x-</span>{" "}
      {t(
        "extension prefix for custom roles. Singer assignments go through the standard",
      )}{" "}
      <span className={INLINE_CODE}>ttm:agent</span> {t("reference.")}
    </p>

    <h4 className={HEADING}>{t("Foreign-namespace extensions")}</h4>
    <p className={PROSE}>
      {t(
        "For features that don't have a place in the core TTML 1 vocabulary, like linked groups and per-instance metadata, RichLyricEditor uses the foreign-namespace extension mechanism in",
      )}{" "}
      <a
        href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#extension-vocabulary-overview"
        target="_blank"
        rel="noreferrer"
        className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
      >
        {t("Section 5.3.2 Extension Catalog")}
      </a>{" "}
      {t(
        "of the spec. The spec explicitly permits arbitrary namespace-qualified elements and attributes from other namespaces. That's the W3C-sanctioned way to add application-specific data while keeping the document conformant.",
      )}
    </p>
    <p className={PROSE}>
      {t("RichLyricEditor's namespace URI is")}{" "}
      <span className={INLINE_CODE}>https://composer.boidu.dev/ttml</span>
      {t(". Custom attributes show up as")}{" "}
      <span className={INLINE_CODE}>composer:groupId</span>
      {t(",")} <span className={INLINE_CODE}>composer:instanceIdx</span>
      {t(", and so on, on the root")}{" "}
      <span className={INLINE_CODE}>&lt;tt&gt;</span> {t("element and on")}{" "}
      <span className={INLINE_CODE}>&lt;p&gt;</span>{" "}
      {t("elements that belong to a linked group. A")}{" "}
      <span className={INLINE_CODE}>&lt;composer:groups&gt;</span>{" "}
      {t("block lives inside")}{" "}
      <span className={INLINE_CODE}>&lt;metadata&gt;</span>{" "}
      {t("to declare the group registry (id, label, color).")}
    </p>

    <h4 className={HEADING}>{t("Why this matters")}</h4>
    <p className={PROSE}>
      {t(
        "You can hand a RichLyricEditor file to any TTML 1 parser and it will work. Tools that don't recognize the",
      )}{" "}
      <span className={INLINE_CODE}>composer:</span>{" "}
      {t(
        "namespace can safely skip the extensions: foreign attributes get pruned during validation (per",
      )}{" "}
      <a
        href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#document-types"
        target="_blank"
        rel="noreferrer"
        className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
      >
        {t("Section 4 Document Types")}
      </a>
      {t(
        "), so the document stays valid, and the rest of the file renders normally. The extensions are additive and scoped to a clearly identified namespace, so there's no chance of attribute collision with other tools that extend TTML for their own purposes.",
      )}
    </p>

    <h4 className={HEADING}>{t("References")}</h4>
    <ul className={`${PROSE} list-disc pl-4 space-y-1.5`}>
      <li>
        <a
          href="https://www.w3.org/TR/2018/REC-ttml1-20181108/"
          target="_blank"
          rel="noreferrer"
          className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
        >
          {t("TTML 1 W3C Recommendation")}
        </a>{" "}
        {t("(the spec)")}
      </li>
      <li>
        <a
          href="https://github.com/w3c/ttml1"
          target="_blank"
          rel="noreferrer"
          className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
        >
          {t("W3C TTML 1 repository")}
        </a>{" "}
        {t("(issues, errata, source)")}
      </li>
      <li>
        <a
          href="https://www.w3.org/TR/2018/REC-ttml1-20181108/#extension-vocabulary-overview"
          target="_blank"
          rel="noreferrer"
          className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
        >
          {t("Section 5.3.2 Extension Catalog")}
        </a>{" "}
        {t("(the section that permits foreign-namespace extensions)")}
      </li>
      <li>
        <a
          href="https://github.com/w3c/ttml1/issues/251"
          target="_blank"
          rel="noreferrer"
          className="text-composer-accent-text hover:text-composer-accent underline-offset-2 hover:underline"
        >
          {t("w3c/ttml1#251")}
        </a>{" "}
        {t(
          "(Working Group discussion clarifying that vocabulary the spec doesn't define gets pruned before validation, so documents stay valid)",
        )}
      </li>
    </ul>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { TtmlStandardsSection };
