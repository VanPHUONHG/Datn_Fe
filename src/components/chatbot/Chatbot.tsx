import React, { useState } from "react";

import { getAllProductVariants } from "services/productVariant/productVariant.service";
import ChatWidget from "./ChatWidget";
import ChatWindow from "./ChatWindow";

interface Message {
  from: "user" | "bot";
  type?: "text" | "product";
  text?: string;
  products?: Variant[];
}

interface Variant {
  size: number;
  price: number;
  discount_price?: number;
  color: string;
  image: string;
  stock_quantity: number;
  is_available: boolean;
  isDeleted?: boolean;
  product_id: {
    _id: string;
    name: string;
    brand: string;
  };
}

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      type: "text",
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về giày theo thương hiệu, size, giá, màu sắc...",
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleQuickSend = async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(text);
  };

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { from: "user", type: "text", text }]);

    setTimeout(async () => {
      const lower = text.toLowerCase();
      const brandMatch = lower.match(/(nike|adidas|puma|mlb|new balance|converse)/i);
      const sizeMatch = lower.match(/size\s?(\d{2})/);
      const priceRangeMatch = lower.match(/(\d+(?:[.,]?\d*)?)\s*(k|tr|triệu)?\s*[-\u0111ến]+\s*(\d+(?:[.,]?\d*)?)\s*(k|tr|triệu)?/);
const singlePriceMatch = lower.match(/(trên|trở lên|trọng|lớn hơn|cao hơn|dưới|ít hơn|nhỏ hơn)?\s*(\d+(?:[.,]?\d*)?)\s*(k|tr|triệu)/);
      const askCount = /bao\s*nhiêu\s*sản phẩm|số lượng|có mấy sản phẩm/.test(lower);
      const colorMatch = lower.match(/màu\s+(trắng|đen|đỏ|xanh|vàng|hồng|nâu|xám|cam|tím|be)/);

      let variants: Variant[] = await getAllProductVariants();

      // Chỉ lấy các biến thể còn hàng, khả dụng, không bị xoá
      variants = variants.filter(
        (v) => v.stock_quantity > 0 && v.is_available && !v.isDeleted
      );

      if (askCount) {
        if (brandMatch) {
          const brand = brandMatch[1].toLowerCase();
          const brandVariants = variants.filter((v) =>
            v.product_id?.brand?.toLowerCase().includes(brand)
          );
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              type: "text",
              text: `Hiện tại shop còn tổng cộng ${brandVariants.length} biến thể sản phẩm thuộc thương hiệu ${brand}.`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              type: "text",
              text: `Shop hiện có tổng cộng ${variants.length} biến thể sản phẩm còn hàng.`,
            },
          ]);
        }
        return;
      }

      if (!brandMatch && !sizeMatch && !priceRangeMatch && !singlePriceMatch && !colorMatch) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            type: "text",
            text: "Vui lòng nhập đúng định dạng câu hỏi như 'giày adidas size 42' hoặc 'giày khoảng 1tr-2tr' để bot hiểu và gợi ý sản phẩm cho bạn!",
          },
        ]);
        return;
      }

      if (brandMatch) {
        const brand = brandMatch[1].toLowerCase();
        variants = variants.filter((v) =>
          v.product_id?.brand?.toLowerCase().includes(brand)
        );
      }

      if (sizeMatch) {
        const size = sizeMatch[1];
        variants = variants.filter((v) => String(v.size) === size);
      }
if (colorMatch) {
  const color = colorMatch[1].toLowerCase();
  variants = variants.filter((v) => v.color.toLowerCase().includes(color));
}
      const getDisplayPrice = (v: Variant) => v.discount_price ?? v.price;

      if (priceRangeMatch) {
        let fromValue = parseFloat(priceRangeMatch[1].replace(",", "."));
        let toValue = parseFloat(priceRangeMatch[3].replace(",", "."));
        const fromUnit = priceRangeMatch[2];
        const toUnit = priceRangeMatch[4];

        if (fromUnit === "k") fromValue *= 1000;
        else if (fromUnit === "tr" || fromUnit === "triệu") fromValue *= 1_000_000;

        if (toUnit === "k") toValue *= 1000;
        else if (toUnit === "tr" || toUnit === "triệu") toValue *= 1_000_000;

        variants = variants.filter(
          (v) => getDisplayPrice(v) >= fromValue && getDisplayPrice(v) <= toValue
        );
      } else if (singlePriceMatch) {
  const keyword = singlePriceMatch[1]; // "trên", "dưới", "nhỏ hơn"...
  let value = parseFloat(singlePriceMatch[2].replace(",", "."));
  const unit = singlePriceMatch[3];

  if (unit === "k") value *= 1000;
  else if (unit === "tr" || unit === "triệu") value *= 1_000_000;

  if (keyword?.includes("dưới") || keyword?.includes("nhỏ") || keyword?.includes("ít")) {
    // Giá nhỏ hơn
    variants = variants.filter((v) => getDisplayPrice(v) < value);
  } else {
    // Mặc định là lớn hơn hoặc bằng
    variants = variants.filter((v) => getDisplayPrice(v) >= value);
  }
}


      if (variants.length > 0) {
        const uniqueVariantsMap = new Map<string, Variant>();

        for (const v of variants) {
          const productName = v.product_id.name;
          if (!uniqueVariantsMap.has(productName)) {
            uniqueVariantsMap.set(productName, v);
          }
        }

        const top3 = Array.from(uniqueVariantsMap.values()).slice(0, 3);
        setMessages((prev) => [
          ...prev,
          { from: "bot", type: "product", products: top3 },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            type: "text",
            text: "Rất tiếc, hiện tại không tìm thấy sản phẩm phù hợp. Bạn có thể thử từ khóa khác như 'giày adidas size 42' hoặc 'giày khoảng 1tr-2tr'.",
          },
        ]);
      }
    }, 500);
  };

  return (
    <>
      <ChatWidget onToggle={() => setOpen(!open)} isOpen={open} />
      {open && (
        <ChatWindow
          messages={messages}
          input={input}
          onChange={setInput}
          onSend={handleSend}
          onQuickSend={handleQuickSend}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ChatBot;
