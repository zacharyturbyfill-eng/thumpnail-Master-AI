import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface ThumbnailConcept {
  analysis: string;
  emotion: string;
  idea: string;
  prompt: string;
  keywords: string[];
  layout: string;
}

export async function generateThumbnailConcept(title: string, imageBase64: string): Promise<ThumbnailConcept> {
  const prompt = `
Bạn là chuyên gia thiết kế Thumbnail YouTube triệu view cho các kênh về Sức khỏe, Đời sống và Review.

Nhiệm vụ: Tạo concept thumbnail dựa trên ảnh gốc nhân vật và tiêu đề: "${title}".

QUY TẮC BỐ CỤC "STRICT 30/70" BẮT BUỘC:
1. VÙNG NHÂN VẬT (TRÁI 30%):
   - Nhân vật chiếm chính xác 30% diện tích khung hình bên trái.
   - Cận cảnh từ ngực trở lên (Medium Close-up).
   - Tay cầm sản phẩm hoặc mẫu vật phải nằm gọn trong vùng 30% này.
   - Hướng nhìn: Hơi nghiêng về phía bên phải (vùng 70%) để dẫn dắt mắt người xem vào nội dung chữ sẽ chèn sau.
2. VÙNG TEXT VÀNG (PHẢI 70%):
   - Phải là không gian trống cực rộng hoặc phông nền cực kỳ mờ (Ultra Deep Bokeh). 
   - Tuyệt đối không có chi tiết thừa lấn vào vùng 70% này để đảm bảo text khi chèn vào sẽ cực kỳ nổi bật.
3. CHI TIẾT PROMPT KỸ THUẬT:
   - Sử dụng các từ khóa: "Extreme rule of thirds", "Character positioned on the far left 30% vertical section", "Massive empty space on the right 70%", "Clean background for text overlay", "Wide angle 16:9".

ĐỊNH DẠNG TRẢ VỀ JSON:
{
  "analysis": "Chiến lược bố cục: Tại sao tỷ lệ 30/70 lại tối ưu cho tiêu đề này?",
  "emotion": "Cảm xúc chủ đạo",
  "idea": "Mô tả: Tư thế nhân vật ở vùng 30% trái, mẫu vật trên tay, độ mờ của vùng 70% phải",
  "prompt": "Highly detailed AI Image Prompt (English). MUST mandate: 'Subject positioned exactly on the left 30% of the frame', 'Right 70% is massive empty space with deep bokeh for text overlay', 'Hand holding product within the left section', 'Cinematic 8k', '16:9'.",
  "keywords": ["TEXT 1", "TEXT 2", "TEXT 3"],
  "layout": "Vị trí đặt text chính xác trong vùng 70% phải, gợi ý màu sắc tương phản mạnh với nền"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBase64.split(",")[1],
                mimeType: "image/jpeg",
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("Không nhận được dữ liệu từ AI.");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating thumbnail concept:", error);
    throw new Error("Cấu hình ảnh hoặc tiêu đề không phù hợp. Vui lòng thử lại.");
  }
}
