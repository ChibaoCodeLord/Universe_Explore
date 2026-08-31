# Kế hoạch tính năng: Các chòm sao Hoàng đạo

## 1. Kết luận sản phẩm

Nên bổ sung nội dung về các ngôi sao tạo nên những chòm sao Hoàng đạo, nhưng triển khai thành một khu vực thiên văn độc lập thay vì đưa trực tiếp vào gallery hành tinh hiện tại.

Hướng đề xuất:

- Thêm mục điều hướng **Constellations**.
- Tạo trang tổng quan `/constellations` để giải thích lý thuyết và cho phép khám phá bản đồ sao.
- Tạo trang chi tiết `/constellation/[slug]` cho từng chòm sao.
- Giới thiệu 12 chòm sao quen thuộc trước, đồng thời giải thích rõ đường hoàng đạo thực tế đi qua 13 chòm sao, bao gồm Ophiuchus (Xà Phu).
- Giữ nội dung theo thiên văn học; không cung cấp tử vi, dự đoán tính cách hoặc khẳng định chiêm tinh là khoa học.

### Lý do chọn cấu trúc riêng

Trang `/explore` hiện mô tả tám hành tinh bằng hai chế độ Gallery và Orbit. Chòm sao là một nhóm vùng trời nhìn từ Trái Đất, không phải một thiên thể đơn lẻ và không thể dùng cùng mô hình bán kính, khối lượng, quỹ đạo hay mô hình cầu 3D của hành tinh. Một route riêng giúp:

- Tránh trộn hai mô hình khoa học khác nhau.
- Có đủ không gian để giải thích “hình chiếu từ Trái Đất” và “khoảng cách thật”.
- Giữ nguyên trải nghiệm hành tinh đang hoạt động.
- Cho phép mở rộng sau này sang toàn bộ 88 chòm sao mà không phải sửa lại kiến trúc.

---

## 2. Mục tiêu

### Mục tiêu chính

1. Giúp người dùng hiểu một chòm sao được nhận diện như thế nào.
2. Cho thấy các ngôi sao trông gần nhau trên bầu trời nhưng không nhất thiết ở gần nhau trong không gian.
3. Giải thích mối liên hệ giữa đường hoàng đạo, 12 cung truyền thống và 13 chòm sao thiên văn.
4. Cho phép khám phá từng chòm sao qua sơ đồ sao dễ hiểu, trực quan và tương tác tốt trên cả desktop lẫn mobile.
5. Mở rộng Universe từ “bộ sưu tập hành tinh” thành một cẩm nang vũ trụ có cấu trúc.

### Không thuộc phạm vi

- Tử vi hằng ngày, bói toán hoặc nội dung dự đoán tương lai.
- Gán đặc điểm tính cách cho người dùng theo ngày sinh.
- Mô phỏng bầu trời chính xác theo thời gian thực hoặc vị trí GPS trong MVP.
- Dựng toàn bộ Dải Ngân Hà hoặc toàn bộ 88 chòm sao trong MVP.
- Mô hình thiên văn phục vụ nghiên cứu chuyên nghiệp.

---

## 3. Đối tượng và nhu cầu người dùng

### Đối tượng chính

- Người mới tìm hiểu thiên văn.
- Học sinh và người dùng trẻ thích trải nghiệm trực quan.
- Người biết tên 12 cung Hoàng đạo nhưng chưa phân biệt cung chiêm tinh với chòm sao thiên văn.
- Người đang khám phá các hành tinh trên Universe và muốn tiếp tục sang bầu trời sao.

### Câu hỏi trang cần trả lời

- Chòm sao là gì?
- Những đường nối giữa các sao có tồn tại thật không?
- Các sao trong cùng một chòm có ở gần nhau không?
- Vì sao thường nói có 12 cung nhưng thiên văn học lại nhắc đến 13 chòm sao trên đường hoàng đạo?
- Ngôi sao nào tạo nên hình dễ nhận biết của từng chòm?
- Khi nào và ở đâu có thể quan sát chòm sao đó?

---

## 4. Nguyên tắc khoa học và biên tập

Mọi nội dung phải giữ bốn thông điệp cốt lõi:

1. **Chòm sao là hình mẫu nhìn từ Trái Đất.** Các đoạn nối sao là quy ước minh họa, không phải cấu trúc vật lý trong không gian.
2. **Các sao có độ sâu khác nhau.** Hai sao trông cạnh nhau có thể cách Trái Đất những khoảng rất khác nhau và không nhất thiết liên kết với nhau.
3. **Cung và chòm sao không hoàn toàn đồng nghĩa.** 12 cung chiêm tinh là 12 phần bằng nhau của vòng Hoàng đạo; chòm sao thiên văn là các vùng trời có ranh giới chính thức và kích thước không bằng nhau.
4. **Đường đi biểu kiến của Mặt Trời qua 13 chòm sao.** Ngoài 12 tên quen thuộc còn có Ophiuchus; nội dung này cần được trình bày như một khác biệt về hệ quy chiếu, không dùng giọng “cung thứ 13 bí mật”.

### Quy tắc ngôn ngữ

- Dùng “chòm sao” cho constellation và “cung” khi nói về zodiac sign trong chiêm tinh.
- Dùng “hình sao” hoặc “đường nối quy ước” cho asterism/line art nếu cần đơn giản hóa.
- Không viết “các ngôi sao tạo thành một nhóm thật” hoặc “nằm cạnh nhau” nếu chỉ đang nói về hình chiếu.
- Khoảng cách nên dùng năm ánh sáng và ghi rõ đây là giá trị gần đúng.
- Độ sáng biểu kiến phải được giải thích bằng ngôn ngữ phổ thông; số magnitude nhỏ hơn nghĩa là trông sáng hơn.
- Tên riêng, khoảng cách và dữ liệu sao phải có nguồn và ngày kiểm tra.

### Nguồn dữ liệu ưu tiên

- IAU: tên và ranh giới chòm sao chính thức.
- SIMBAD: định danh, tọa độ và thông tin sao.
- Gaia hoặc nguồn catalogue thiên văn được trích dẫn rõ: khoảng cách sao.
- Stellarium: dùng để đối chiếu cách biểu diễn và khả năng quan sát, không sao chép tài sản chưa rõ giấy phép.

Tạo một bảng nguồn nội bộ cho từng trường dữ liệu. Không đưa số liệu chưa kiểm chứng trực tiếp vào `lib/constellations.ts`.

---

## 5. Kiến trúc thông tin

```text
Home
├── Solar System teaser
├── Zodiac Constellations teaser (mới)
└── CTA khám phá

Explore Solar System                /explore
├── Gallery
└── Orbit

Explore Constellations              /constellations
├── Hero + định nghĩa
├── Interactive zodiac sky map
├── How constellations work
├── 12 vs 13 explainer
├── Constellation gallery
└── Common misconceptions

Constellation detail                /constellation/[slug]
├── Star pattern
├── Key stars
├── View from Earth / True depth
├── Observation guide
├── Story and naming
└── Sources
```

### Điều hướng chính

Header đề xuất:

- Home
- Planets
- Constellations

`Explore` hiện tại nên đổi nhãn hiển thị thành **Planets** nhưng giữ route `/explore` để không làm hỏng liên kết cũ. Nếu muốn giữ chữ **Explore**, dùng menu con hoặc một trang hub `/explore`; không cần làm việc này trong MVP.

---

## 6. Trải nghiệm trang `/constellations`

### 6.1. Hero

Mục tiêu: tạo tò mò nhưng nói ngay đây là nội dung thiên văn.

Nội dung mẫu, đồng bộ với ngôn ngữ tiếng Anh hiện tại của website:

- Eyebrow: `A FIELD GUIDE TO THE ZODIAC`
- H1: `Patterns written in our sky.`
- Lead: `From Earth, distant stars appear to draw familiar figures along the Sun’s path. Step closer to see the pattern—and the depth hidden behind it.`
- CTA chính: `Explore the sky map`
- CTA phụ: `How constellations work`

Hình ảnh: nền sao tối, đường Hoàng đạo cong nhẹ, 12 biểu tượng bố trí theo cung và một điểm nhấn cho Ophiuchus. Không dùng vòng tròn lá số tử vi làm hình chính vì dễ khiến sản phẩm bị hiểu thành ứng dụng chiêm tinh.

### 6.2. Interactive zodiac sky map

Đây là trải nghiệm chính của trang.

#### Chế độ mặc định: From Earth

- Hiển thị dải Hoàng đạo dạng bản đồ ngang hoặc vòng cung.
- Hiển thị các điểm sao theo độ sáng tương đối.
- Nối những sao chính bằng đường mảnh.
- Hover/focus: hiện tên chòm sao và ngôi sao sáng nhất.
- Click/tap: chọn chòm sao và mở panel tóm tắt.
- CTA trong panel: `Open constellation`.

#### Chế độ mở rộng: True depth

- Cho phép kéo hoặc chuyển bằng toggle từ hình chiếu 2D sang minh họa độ sâu.
- Các sao dịch chuyển theo khoảng cách tương đối để cho thấy hình quen thuộc bị biến dạng khi đổi góc nhìn.
- Gắn nhãn rõ `Illustrative depth — distances are scaled`.
- Chế độ này là P1; MVP có thể dùng một animation giải thích cho một chòm đại diện trước, đề xuất Orion hoặc Scorpius. Nếu chỉ giới hạn trong Hoàng đạo, dùng Scorpius.

### 6.3. “How constellations work”

Chia thành ba bước ngắn:

1. **Look up:** mắt người nhận ra mẫu từ các điểm sáng.
2. **Draw the pattern:** các nền văn hóa đặt tên và kể những câu chuyện khác nhau.
3. **Add the depth:** thiên văn học đo vị trí và khoảng cách thật của từng sao.

Mỗi bước có một minh họa nhỏ dùng cùng một tập điểm sao: điểm rời → đường nối → lớp độ sâu.

### 6.4. “Twelve signs, thirteen constellations”

Thiết kế dạng so sánh hai cột:

| 12 zodiac signs | 13 ecliptic constellations |
| --- | --- |
| 12 phần bằng nhau, mỗi phần 30° | Các vùng trời có kích thước không bằng nhau |
| Thuộc hệ thống chiêm tinh truyền thống | Thuộc bản đồ chòm sao thiên văn |
| Gắn với lịch và biểu tượng | Gắn với ranh giới quan sát trên bầu trời |
| Không có Ophiuchus | Đường Hoàng đạo đi qua Ophiuchus |

Microcopy bắt buộc: `The two systems answer different questions; one does not simply replace the other.`

### 6.5. Gallery chòm sao

MVP hiển thị 13 card:

1. Aries
2. Taurus
3. Gemini
4. Cancer
5. Leo
6. Virgo
7. Libra
8. Scorpius
9. Sagittarius
10. Capricornus
11. Aquarius
12. Pisces
13. Ophiuchus

Mỗi card gồm:

- Sơ đồ sao mini bằng SVG.
- Tên Latin/English.
- Tên tiếng Việt nếu có bản địa hóa.
- Ngôi sao nổi bật nhất.
- Số sao chính đang được dùng trong hình minh họa.
- Một câu mô tả nhận diện.
- CTA `Explore [name]`.

Ophiuchus cần badge trung tính `Also crossed by the ecliptic`, không dùng badge gây giật gân như `Secret 13th sign`.

### 6.6. Common misconceptions

Dùng accordion bốn câu hỏi:

- Các đường nối sao có thật không?
- Các sao trong cùng chòm có ở gần nhau không?
- Vì sao hình chòm sao không giống tên gọi?
- Chòm sao Hoàng đạo có quyết định tính cách không?

Câu cuối trả lời ngắn gọn: đây là một trang thiên văn và không đưa ra kết luận chiêm tinh.

### 6.7. CTA cuối trang

- Heading: `The pattern is only the beginning.`
- CTA chính: `Choose a constellation`
- CTA chéo: `Return to the planets`

---

## 7. Trang chi tiết `/constellation/[slug]`

### Bố cục desktop

- Cột trái: bản đồ sao tương tác, sticky trong viewport.
- Cột phải: nội dung, danh sách sao và hướng dẫn quan sát.
- Mobile: bản đồ ở trên, nội dung ở dưới; tránh sticky.

### Các khối nội dung

1. **Hero metadata**
   - Tên chòm sao.
   - Tên viết tắt IAU.
   - Nghĩa hoặc hình tượng của tên.
   - Nhóm: Zodiac constellation.

2. **Interactive star pattern**
   - Toggle `Pattern` / `Stars` / `Depth`.
   - Pattern: điểm và đường nối.
   - Stars: tắt đường để thấy dữ liệu thô.
   - Depth: minh họa khoảng cách tương đối, nếu dữ liệu đủ tin cậy.

3. **Key stars**
   - Tên riêng hoặc định danh Bayer.
   - Độ sáng biểu kiến.
   - Khoảng cách gần đúng.
   - Loại sao hoặc màu biểu kiến.
   - Vai trò trong hình nối.

4. **How to find it**
   - Bán cầu quan sát thuận lợi.
   - Khoảng tháng quan sát tốt, ghi rõ còn phụ thuộc vị trí.
   - Các chòm sao lân cận dùng làm mốc.
   - Không tuyên bố một lịch duy nhất đúng cho mọi nơi trên Trái Đất.

5. **Story behind the pattern**
   - Nguồn gốc tên gọi Hy-La nếu phù hợp.
   - Ghi chú rằng các nền văn hóa có thể diễn giải cùng vùng trời theo cách khác.
   - Tránh trình bày một thần thoại như nguồn gốc duy nhất của chòm sao.

6. **Astronomy note**
   - Một fact khoa học đáng nhớ, ví dụ loại sao, cụm sao hoặc thiên thể sâu trong vùng trời đó.

7. **Sources and data note**
   - Danh sách nguồn.
   - Ngày dữ liệu được kiểm tra.
   - Ghi chú khoảng cách là giá trị gần đúng nếu có bất định.

8. **Previous/next navigation**
   - Điều hướng tuần tự qua 13 chòm sao.
   - Link quay lại bản đồ tổng quan.

---

## 8. Mô hình dữ liệu đề xuất

Không mở rộng interface `Planet`. Tạo kiểu dữ liệu riêng trong `lib/constellations.ts` hoặc tách thành `lib/constellations/types.ts` và `lib/constellations/data.ts` khi dữ liệu lớn.

```ts
type ConstellationStar = {
  id: string;
  name: string;
  bayerDesignation?: string;
  x: number;                 // tọa độ chuẩn hóa 0..1 cho sơ đồ MVP
  y: number;                 // tọa độ chuẩn hóa 0..1 cho sơ đồ MVP
  rightAscension?: number;   // dùng khi chuyển sang phép chiếu thật
  declination?: number;
  apparentMagnitude: number;
  distanceLightYears?: number;
  spectralClass?: string;
  color: string;
  sourceIds: string[];
};

type ConstellationEdge = {
  from: string;
  to: string;
};

type ObservationGuide = {
  bestMonthsNorthern?: string[];
  bestMonthsSouthern?: string[];
  visibleLatitudes?: string;
  nearbyLandmarks: string[];
  note: string;
};

type Constellation = {
  id: string;
  slug: string;
  orderAlongEcliptic: number;
  name: string;
  vietnameseName?: string;
  iauAbbreviation: string;
  symbol?: string;
  accent: string;
  meaning: string;
  shortDescription: string;
  overview: string;
  brightestStarId?: string;
  stars: ConstellationStar[];
  edges: ConstellationEdge[];
  observation: ObservationGuide;
  mythologySummary?: string;
  astronomyNote: string;
  isTraditionalZodiac: boolean;
  isCrossedByEcliptic: boolean;
  sources: Array<{
    label: string;
    url: string;
    checkedAt: string;
  }>;
};
```

### Validation dữ liệu

Viết hàm hoặc test kiểm tra:

- `slug`, `id` và `orderAlongEcliptic` không trùng.
- Mỗi `edge.from` và `edge.to` đều trỏ đến một star ID tồn tại.
- Tọa độ `x`, `y` nằm trong khoảng 0–1.
- Magnitude và khoảng cách là số hợp lệ.
- Chỉ 12 mục có `isTraditionalZodiac: true`.
- Tất cả 13 mục có `isCrossedByEcliptic: true` trong bộ dữ liệu MVP.
- Mỗi số liệu có nguồn tương ứng.

---

## 9. Kiến trúc kỹ thuật dự kiến

### File mới

```text
app/
├── constellations/
│   ├── page.tsx
│   ├── ConstellationExperience.tsx
│   ├── ConstellationMap.tsx
│   ├── ConstellationCard.tsx
│   └── constellations.css
├── constellation/
│   └── [slug]/
│       ├── page.tsx
│       ├── ConstellationDetail.tsx
│       └── constellation-detail.css
└── components/
    └── StarPattern.tsx

lib/
└── constellations.ts

public/
└── constellations/
    └── optional-static-assets
```

### File cần cập nhật

- `app/components/SiteHeader.tsx`: thêm trạng thái active và link Constellations.
- `app/page.tsx`: thêm teaser dẫn vào khu vực chòm sao.
- `app/globals.css`: chỉ thêm token dùng chung nếu thực sự cần; CSS tính năng để trong thư mục route.
- `app/layout.tsx`: cập nhật mô tả website từ Solar System sang cosmic field guide rộng hơn.
- `README.md`: mô tả route, nguồn dữ liệu và lệnh kiểm tra.

### Ranh giới Server/Client Component

- `page.tsx`, metadata và nội dung tĩnh: Server Components.
- Chọn chòm sao, toggle layer và animation: Client Components nhỏ, tách biệt.
- Truyền dữ liệu cần thiết vào client thay vì biến toàn bộ trang thành `"use client"`.
- Dùng `generateStaticParams()` cho 13 trang chi tiết.
- Bản đồ sao MVP nên dùng SVG. Chỉ dùng React Three Fiber cho chế độ depth nâng cao nếu SVG/CSS không đủ.

### URL state

Đề xuất hỗ trợ:

```text
/constellations?constellation=scorpius&view=pattern
/constellations?constellation=scorpius&view=depth
```

Điều này giúp chia sẻ đúng trạng thái đang xem, tương tự cách `/explore` đang lưu `view` và `planet` vào query string.

---

## 10. Thiết kế hình ảnh và chuyển động

### Hướng mỹ thuật

- Giữ nền navy, parchment, gold và texture grain hiện tại.
- Điểm sao dùng cream/gold; chỉ dùng màu sao khi đang ở layer khoa học.
- Đường nối mảnh, hơi thủ công để đồng bộ phong cách “handcrafted cosmic field guide”.
- Mỗi chòm sao có một màu accent nhưng không dùng màu để truyền đạt trạng thái duy nhất.
- Tránh icon zodiac quá lớn hoặc bố cục giống lá số.

### Chuyển động

- Khi vào viewport: sao hiện lần lượt, sau đó đường nối được vẽ.
- Khi chọn card: map pan/scale nhẹ về chòm tương ứng.
- Toggle Pattern/Stars: crossfade, không flash.
- Toggle Depth: parallax chậm và có nút reset.
- Tôn trọng `prefers-reduced-motion`; trong chế độ giảm chuyển động, hiển thị trạng thái cuối ngay lập tức.

---

## 11. Accessibility

### Bắt buộc cho MVP

- Tất cả thao tác hover đều có bản tương đương bằng focus và tap.
- Star map dùng SVG có `<title>` và `<desc>` hoặc có phần mô tả văn bản tương đương ngay cạnh.
- Mỗi điểm sao tương tác có tên truy cập rõ, ví dụ `Antares, apparent magnitude 0.96`.
- Không yêu cầu người dùng nhắm chính xác vào một điểm sao nhỏ; hit area tối thiểu 44 × 44 CSS px nếu tương tác.
- Điều hướng giữa các chòm bằng phím mũi tên khi dùng pattern tablist/listbox.
- Focus ring rõ trên nền tối.
- Không chỉ dựa vào màu hoặc kích thước để phân biệt sao được chọn.
- Panel cập nhật dùng `aria-live="polite"`, tránh đọc lại toàn bộ bản đồ.
- Thứ tự DOM phải hợp lý ngay cả khi desktop dùng bố cục hai cột.
- Reduced motion phải bao phủ cả Framer Motion lẫn animation CSS/SVG.
- Kiểm tra contrast theo WCAG AA.

### Mô tả thay thế mẫu

`Scorpius is shown as 12 plotted stars connected into a long hooked shape. Antares is the brightest highlighted point near the center.`

---

## 12. Responsive behavior

### Desktop, từ 1024 px

- Sky map chiếm phần lớn chiều ngang.
- Panel thông tin nằm bên phải hoặc nổi trong canvas.
- Gallery 3–4 cột tùy chiều rộng.

### Tablet, 640–1023 px

- Map full width, panel bên dưới.
- Gallery hai cột.
- Điều khiển map chuyển thành thanh ngang có thể cuộn.

### Mobile, dưới 640 px

- Map có aspect ratio cố định, không vượt quá chiều cao màn hình.
- Gallery một cột hoặc carousel có nút previous/next rõ ràng.
- Tooltip chuyển thành bottom sheet; không phụ thuộc hover.
- Tên dài như Sagittarius/Capricornus không bị cắt.
- Giảm số nhãn sao hiển thị đồng thời để tránh chồng chữ.

---

## 13. SEO và chia sẻ

- Metadata trang tổng quan: `Zodiac Constellations | Universe`.
- Mỗi trang chi tiết có title, description và social image riêng.
- Nội dung lý thuyết quan trọng phải tồn tại trong HTML server-rendered, không chỉ trong canvas.
- Dùng heading hierarchy rõ: một H1, các section H2, card title H3.
- Thêm JSON-LD dạng `Article` hoặc `ItemList` sau MVP nếu nội dung đủ ổn định.
- Social image có pattern của chòm sao và tên, không dùng biểu tượng chiêm tinh đơn lẻ.

---

## 14. Hiệu năng

### Mục tiêu

- Không làm tăng bundle của trang `/explore` hiện tại.
- Trang tổng quan phải tương tác được nhanh ngay cả khi chưa tải chế độ depth.
- SVG pattern ưu tiên dưới khoảng 25 KB/chòm sau tối ưu.
- Lazy-load phần depth/Three.js nếu được thêm.
- Không tải ảnh raster lớn chỉ để hiển thị các điểm và đường có thể dựng bằng SVG.
- Tránh render lại toàn bộ 13 map khi người dùng chỉ chọn một chòm.

### Cách thực hiện

- Dùng một component `StarPattern` tái sử dụng.
- Gallery mini-map có thể dùng SVG tĩnh server-rendered.
- Chỉ map chính mới có state tương tác.
- Dynamic import cho component 3D hoặc thư viện projection bổ sung.
- Không thêm package mới cho phép chiếu đơn giản; chỉ cân nhắc thư viện khi chuyển sang dữ liệu RA/Dec đầy đủ.

---

## 15. Analytics đề xuất

Chỉ thêm nếu dự án đã có hoặc chấp thuận một hệ thống analytics.

Các event hữu ích:

- `constellations_page_view`
- `constellation_selected` với `slug`
- `constellation_view_changed` với `pattern | stars | depth`
- `constellation_detail_opened`
- `theory_section_completed`
- `source_link_opened`

Chỉ số đánh giá:

- Tỷ lệ từ Home sang Constellations.
- Tỷ lệ tương tác với map.
- Số chòm trung bình được chọn trong một phiên.
- Tỷ lệ mở trang chi tiết.
- Tỷ lệ dùng layer Stars hoặc Depth.

Không thu thập ngày sinh vì tính năng không cần dữ liệu đó.

---

## 16. Các giai đoạn triển khai

### Phase 0 — Research và content inventory

- Chốt tên tiếng Anh/Việt và cách viết thống nhất.
- Chọn tập sao chính cho từng hình nối.
- Thu thập nguồn, giấy phép và ngày truy cập.
- Xác minh khoảng cách, magnitude, tọa độ và ngôi sao sáng nhất.
- Viết nội dung lý thuyết và disclaimer thiên văn/chiêm tinh.

**Đầu ra:** bảng dữ liệu được duyệt và content draft cho 13 chòm.

### Phase 1 — MVP foundation

- Tạo kiểu dữ liệu và dataset.
- Tạo `StarPattern` bằng SVG.
- Tạo `/constellations` với hero, theory, 12-vs-13 và gallery.
- Thêm navigation và homepage teaser.
- Tạo metadata.
- Hoàn thiện responsive và reduced motion.

**Đầu ra:** người dùng hiểu khái niệm và khám phá được 13 pattern trên một trang.

### Phase 2 — Detail pages

- Tạo route động và `generateStaticParams()`.
- Thêm key stars, observation guide, story, astronomy note và sources.
- Thêm previous/next navigation.
- Tạo social metadata riêng.

**Đầu ra:** 13 trang chi tiết hoàn chỉnh.

### Phase 3 — True depth interaction

- Chuẩn hóa dữ liệu khoảng cách.
- Dựng chế độ depth minh họa.
- Thêm nhãn scale và camera reset.
- Kiểm tra hiệu năng mobile và reduced motion.

**Đầu ra:** người dùng trực tiếp thấy hình chòm sao thay đổi khi rời góc nhìn Trái Đất.

### Phase 4 — Localization và mở rộng

- Tách copy khỏi component để hỗ trợ English/Vietnamese.
- Thêm ngôn ngữ tiếng Việt và kiểm tra typography.
- Cân nhắc bầu trời theo vị trí/thời gian hoặc mở rộng sang 88 chòm sao.

**Đầu ra:** trải nghiệm song ngữ và nền tảng dữ liệu có khả năng mở rộng.

---

## 17. Ưu tiên phạm vi

### P0 — Bắt buộc

- Route tổng quan.
- Phần lý thuyết chòm sao.
- Giải thích 12 và 13.
- 13 pattern SVG.
- Chọn chòm bằng chuột, cảm ứng và bàn phím.
- Gallery và panel tóm tắt.
- Source note.
- Responsive, reduced motion và accessibility cơ bản.
- Header và homepage teaser.

### P1 — Nên có

- 13 trang chi tiết.
- Key-star tooltips.
- URL giữ trạng thái đang chọn.
- Observation guide.
- Mythology/context đa văn hóa.
- True-depth cho ít nhất một chòm đại diện.

### P2 — Có thể làm sau

- True-depth cho cả 13 chòm.
- Bản đồ theo thời gian và vị trí quan sát.
- Song ngữ hoàn chỉnh.
- Search/filter.
- Quiz nhận diện chòm sao.
- Mở rộng sang 88 chòm sao.

---

## 18. Kiểm thử

### Data tests

- Không có slug hoặc star ID trùng.
- Tất cả edge hợp lệ.
- Tất cả tọa độ nằm trong range.
- 12 traditional zodiac và 13 ecliptic constellation đúng theo dataset.
- Mỗi chòm có tối thiểu một nguồn.

### Component tests

- Chọn chòm cập nhật panel.
- Toggle layer cập nhật đúng UI và `aria-pressed`.
- Previous/next loop đúng qua 13 mục.
- Keyboard navigation hoạt động.
- Query string hợp lệ được khôi phục; giá trị sai dùng fallback an toàn.

### Integration/E2E

- Home → Constellations → Detail → Back hoạt động.
- Refresh tại URL có state không làm mất lựa chọn.
- Các route tĩnh của 13 chòm đều render.
- Không ảnh hưởng `/explore` và `/object/[slug]`.
- Not-found hoạt động với slug không tồn tại.

### Visual QA

- 1440 × 900 desktop.
- 1024 × 768 tablet landscape.
- 768 × 1024 tablet portrait.
- 390 × 844 mobile.
- Light/low-power motion setting và `prefers-reduced-motion`.
- Không chồng nhãn sao, không cắt tooltip/bottom sheet và không có horizontal overflow.

### Quality gates

```bash
npm run lint
npm run build
```

Chạy thêm test suite tương ứng nếu dự án bổ sung framework test trong quá trình triển khai.

---

## 19. Tiêu chí nghiệm thu MVP

MVP được coi là hoàn thành khi:

- Người dùng truy cập được `/constellations` từ header và Home.
- Trang nói rõ chòm sao là hình chiếu từ Trái Đất, không phải một nhóm sao vật lý.
- Trang giải thích chính xác và trung tính sự khác nhau giữa 12 cung truyền thống và 13 chòm sao trên đường Hoàng đạo.
- Cả 13 chòm đều có pattern, tên, mô tả và nguồn.
- Người dùng chọn được từng chòm bằng mouse, touch và keyboard.
- Trạng thái chọn có visual state và accessible name rõ ràng.
- Mobile không phụ thuộc hover.
- Reduced motion không chạy animation vẽ sao/đường kéo dài.
- Nội dung quan trọng đọc được khi JavaScript chưa chạy.
- `npm run lint` và `npm run build` pass.
- Các route hành tinh hiện tại không bị regression.

---

## 20. Rủi ro và cách giảm thiểu

| Rủi ro | Tác động | Cách giảm thiểu |
| --- | --- | --- |
| Dữ liệu sao từ nhiều catalogue không đồng nhất | Sai số hoặc thông tin mâu thuẫn | Chọn một nguồn chính cho từng loại dữ liệu, lưu nguồn và ngày kiểm tra |
| Người dùng hiểu nhầm đây là tính năng tử vi | Lệch định vị sản phẩm | Dùng copy thiên văn ngay từ hero, tránh visual lá số và có mục 12-vs-13 |
| Map quá nhiều nhãn trên mobile | Khó đọc và khó thao tác | Chỉ hiện nhãn sao chính, dùng bottom sheet khi tap |
| 3D depth làm bundle nặng | Chậm tải và giảm trải nghiệm | SVG-first, lazy-load depth và để depth ở P1/P2 |
| Thần thoại bị trình bày như cách hiểu duy nhất | Nội dung thiếu cân bằng văn hóa | Ghi rõ nguồn truyền thống và thừa nhận các cách diễn giải khác |
| Scope phình từ 13 lên 88 chòm | Chậm ra mắt | Giữ dataset/route có thể mở rộng nhưng khóa MVP ở 13 |
| Website hiện dùng tiếng Anh trong khi kế hoạch có thể cần tiếng Việt | Trải nghiệm không nhất quán | MVP tiếp tục English; localization là phase riêng hoặc chốt đổi toàn site trước khi viết copy final |

---

## 21. Ước lượng sơ bộ

Ước lượng cho một người triển khai, chưa tính thời gian chờ duyệt nội dung:

| Hạng mục | Thời lượng |
| --- | ---: |
| Research, nguồn và chuẩn hóa dữ liệu | 1.5–3 ngày |
| UX/UI và prototype SVG | 1–2 ngày |
| Trang tổng quan MVP | 2–3 ngày |
| Responsive, accessibility, QA | 1.5–2 ngày |
| 13 trang chi tiết | 2–4 ngày |
| True-depth interaction | 2–4 ngày |

**MVP hợp lý:** khoảng 6–10 ngày làm việc.  
**MVP + detail pages + depth:** khoảng 10–16 ngày làm việc.

Ước lượng có thể giảm nếu nội dung và dataset đã được chuẩn bị, hoặc tăng nếu cần song ngữ và dữ liệu quan sát chính xác theo vị trí.

---

## 22. Thứ tự thực hiện được đề xuất

1. Duyệt thông điệp khoa học và phạm vi 13 chòm.
2. Chuẩn hóa dataset có nguồn trước khi làm UI.
3. Prototype một `StarPattern` với Scorpius trên desktop và mobile.
4. Chốt visual language rồi nhân rộng thành 13 pattern.
5. Hoàn thiện trang tổng quan và navigation.
6. Làm accessibility/QA cho MVP.
7. Bổ sung detail pages.
8. Chỉ triển khai True Depth sau khi dữ liệu khoảng cách và hiệu năng đã đạt yêu cầu.

---

## 23. Quyết định mặc định để có thể bắt tay triển khai

Nếu không có yêu cầu thay đổi, implementation sẽ dùng các quyết định sau:

- Nội dung UI tiếp tục bằng tiếng Anh để khớp website hiện tại.
- Kế hoạch và tài liệu nội bộ dùng tiếng Việt.
- Phạm vi MVP gồm 13 chòm sao trên đường Hoàng đạo.
- SVG 2D là công nghệ hiển thị chính.
- Ophiuchus được giới thiệu như một chòm sao đường Hoàng đạo, không phải một “cung bí mật”.
- Route mới là `/constellations` và `/constellation/[slug]`.
- `/explore` tiếp tục dành riêng cho hành tinh.
- True Depth và localization đầy đủ được xếp sau MVP.

