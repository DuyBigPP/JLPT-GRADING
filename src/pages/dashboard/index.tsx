import { BookOpenCheck, Calculator, CircleAlert, ListChecks, Radar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SEO } from "@/components/common/SEO"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <SEO
        title="Hướng dẫn sử dụng"
        description="Hướng dẫn sử dụng hệ thống chấm điểm bài làm đề thi JLPT N1-N5. Cách nhập đáp án, đọc kết quả, và điều chỉnh trọng số."
        path="/dashboard"
      />
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-card to-accent/15">
        <CardHeader>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 uppercase tracking-wide">
            Hệ thống chấm điểm bài làm đề thi JLPT 
          </Badge>
          <CardTitle className="mt-2 text-3xl leading-tight">Hướng dẫn sử dụng hệ thống chấm điểm</CardTitle>
          <CardDescription className="max-w-3xl text-sm sm:text-base">
            Ứng dụng giúp bạn ước tính điểm thi thử JLPT theo từng mondai, theo dõi điểm thành phần,
            và kiểm tra nhanh điều kiện đỗ theo mức tổng điểm và điểm liệt.
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert className="border-destructive/40 bg-destructive/5">
        <CircleAlert />
        <AlertTitle className="font-semibold text-destructive">LƯU Ý</AlertTitle>
        <AlertDescription className="text-destructive/90">
          Kết quả tính điểm này chỉ mang tính chất tham khảo tương đối, do đơn vị tổ chức JLPT
          không công bố cách thức tính điểm chính thức. Có giời mới biết mấy thằng cha đấy tính như nào.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="size-5" />
              Luồng thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>1. Mở trang Chấm điểm JLPT và chọn cấp độ N1 - N5.</p>
            <p>2. Nhập số câu đúng cho từng mondai.</p>
            <p>3. Điều chỉnh trọng số nếu bạn muốn mô phỏng đề thi riêng.</p>
            <p>4. Đọc điểm tổng, điểm section, kết quả đạt/không đạt.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="size-5" />
              Cách tính điểm ước tính
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Điểm section = (điểm trọng số đạt được / điểm trọng số tối đa) x điểm tối đa section.</p>
            <p>Tổng điểm = tổng điểm section, tối đa 180 điểm.</p>
            <p>Kết quả đạt cần đồng thời qua ngưỡng tổng điểm và không vi phạm điểm liệt.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radar className="size-5" />
              Lưu ý khi điền kết quả
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Số câu trong mondai có thể dao động nhẹ theo từng đợt thi thực tế.</p>
            <p>Trọng số cao dành cho câu nhiều ngữ cảnh, độ dài, hoặc tổng hợp.</p>
            <p>Nên dùng kết quả để điều chỉnh chiến lược ôn tập, không thay thế điểm JLPT chính thức.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpenCheck className="size-5" />
            Cách đọc kết quả sau khi chấm
          </CardTitle>
          <CardDescription>
            Ưu tiên xem trạng thái đỗ/trượt, sau đó kiểm tra section nào đang cần cải thiện.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2">
            <p>
              Nếu tổng điểm đã đạt nhưng vẫn trượt, lý do thường là vì chạm điểm liệt tại một section.
              Bạn nên tập trung vào section đó trước khi tiếp tục nâng điểm tổng.
            </p>
            <p>
              Hệ thống cho phép chỉnh trọng số để mô phỏng đề thi theo mức độ khó mà bạn đang luyện.
              Có thể reset nhanh để quay về bộ trọng số mặc định.
            </p>
          </div>
          <Separator />
          <Alert className="border-primary/40 bg-primary/5">
            <CircleAlert />
            <AlertTitle>Lưu ý kết quả</AlertTitle>
            <AlertDescription>
              Lưu ý: Kết quả tính điểm này chỉ mang tính chất tham khảo tương đối, do đơn vị tổ chức JLPT
              không công bố cách thức tính điểm chính thức.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
