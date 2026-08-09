import {
  IDECO_MONTHLY_CAPS,
  type IdecoCategory,
} from "@/lib/calculators/ideco";

export const CATEGORY_OPTIONS: { value: IdecoCategory; label: string }[] = [
  {
    value: "company-no-pension",
    label: `会社員（企業年金なし）｜上限 ${IDECO_MONTHLY_CAPS["company-no-pension"].toLocaleString()}円/月`,
  },
  {
    value: "company-dc",
    label: `会社員（企業型DCのみ）｜上限 ${IDECO_MONTHLY_CAPS["company-dc"].toLocaleString()}円/月`,
  },
  {
    value: "company-db",
    label: `会社員（DB等）・公務員｜上限 ${IDECO_MONTHLY_CAPS["company-db"].toLocaleString()}円/月`,
  },
];
