import { GradingCalculator } from "@/features/jlpt-grading/GradingCalculator"
import { SEO } from "@/components/common/SEO"

const Grading = () => {
  return (
    <>
      <SEO
        title="Công cụ chấm điểm JLPT N1-N5"
        description="Tính điểm ước tính bài thi JLPT theo từng mondai. Chọn cấp độ N1-N5, nhập số câu đúng, tùy chỉnh trọng số, kiểm tra điều kiện đỗ và điểm liệt."
        path="/grading"
      />
      <GradingCalculator />
    </>
  )
}

export default Grading