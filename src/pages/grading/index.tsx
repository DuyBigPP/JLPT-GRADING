import { useTranslation } from "react-i18next"
import { GradingCalculator } from "@/features/jlpt-grading/GradingCalculator"
import { SEO } from "@/components/common/SEO"

const Grading = () => {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t("grading.seoTitle")}
        description={t("grading.seoDescription")}
        path="/grading"
      />
      <GradingCalculator />
    </>
  )
}

export default Grading
