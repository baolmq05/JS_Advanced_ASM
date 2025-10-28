import { Product } from "../service/product.service.js";
import { Category } from "../service/category.service.js";
const product = new Product();
let productList = [];

const category = new Category();

let chatHistory = [];
let SYSTEM_PROMPT;

const API_KEY = "AIzaSyAhOMzC5SU0tGj37zeWwpuHMBfBYRu3bRM";
const MODEL_NAME = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
const HISTORY_KEY = "gemini_chat_history"; //Key Session

const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');
const chatContainer = document.getElementById('chat-container');
const chatTrigger = document.getElementById('chat-trigger');
const closeChatBtn = document.getElementById('close-chat-btn');

chatTrigger.addEventListener('click', () => {
    chatContainer.style.display = 'flex';
    chatTrigger.style.display = 'none';
});

closeChatBtn.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    chatTrigger.style.display = 'flex';
});

const saveHistory = () => {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(chatHistory));
}

async function loadHistory() {
    const savedHistory = sessionStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);

        chatWindow.innerHTML = '';

        // Render history
        for (const message of chatHistory) {
            if (message.role === 'user') {
                chatWindow.innerHTML += `<div class="user-message"><b>Bạn:</b> ${message.parts[0].text}</div>`;
            } else if (message.role === 'model') {
                chatWindow.innerHTML += `<div class="bot-message"><b>Bot:</b> ${message.parts[0].text}</div>`;
            }
        }
    } else {
        await category.categoryLoadData();
        let categoryList = category.getCategoryList();
        await product.productLoadData();
        let productText = ``;
        productList = product.getProductList();
        productList.forEach(element => {
            let cateCurrent = categoryList.find(cateItem => cateItem.id == element.category_id);
            let productItemText = `Tên sản phẩm: ${element.name}. Giá cơ bản: ${element.base_price}. Danh mục là: ${cateCurrent.name}. Mô tả sản phẩm là: ${element.description}. Và các biến thể của nó là: (`;

            element.product_variants.forEach(variant => {
                let variantItemText = `(Tên biến thể: ${variant.variant_name}. Giá: ${variant.price}. Số lượng: ${variant.quantity}. Màu sắc: ${variant.color}. Bộ nhớ trong: ${variant.rom}) - `;
                productItemText += variantItemText;
            });

            productText += productItemText;
        });

        SYSTEM_PROMPT = `
                    Bạn là một nhân viên tư vấn tên là Bot, làm việc tại cửa hàng Mobile Store. Nhiệm vụ của bạn là tư vấn cho khách hàng một cách thân thiện, vui vẻ, và luôn chiều lòng khách hàng.
                    Bạn CHỈ được phép trả lời các câu hỏi liên quan đến các sản phẩm và dịch vụ của Mobile Store. Các sản phẩm của chúng ta bao gồm:
                    ${productText}. 
                    Nếu khách hàng hỏi về bất cứ chủ đề nào khác (ví dụ: thời tiết, tin tức, chính trị, công thức nấu ăn, hay các cửa hàng đối thủ), bạn PHẢI lịch sự từ chối và lái cuộc trò chuyện về sản phẩm của Mobile Store.
                    Ví dụ từ chối: 'Xin lỗi, tôi là trợ lý ảo của Mobile Store nên không rõ về thông tin đó. Tuy nhiên, tôi có thể giúp bạn tìm một chiếc điện thoại mới hoặc một củ sạc phù hợp. Bạn đang quan tâm sản phẩm nào ạ?
                    Câu trả lời của bạn phải được bọc trong các thẻ html có css inline đẹp mắt'
                `;

        chatHistory.push({
            role: 'model',
            parts: [{ text: 'Chào bạn, tôi có thể giúp gì cho Mobile Store?' }]
        });
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

async function sendMessage() {
    const message = chatInput.value;
    if (message.trim() === "") return;

    chatWindow.innerHTML += `<div class="user-message"><b>Tôi:</b> ${message}</div>`;

    const userMessage = { role: "user", parts: [{ text: message }] };
    chatHistory.push(userMessage);

    chatInput.value = "";
    chatWindow.innerHTML += `<div class="bot-message" id="loading"><b>Bot:</b> Đang suy nghĩ...</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const requestBody = {
        systemInstruction: {
            "role": "system",
            "parts": [{ "text": SYSTEM_PROMPT }]
        },
        contents: chatHistory
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        alert("Lỗi hệ thống");
    }

    const data = await response.json();

    const botReply = data.candidates[0].content.parts[0].text;

    const botMessage = { role: "model", parts: [{ text: botReply }] };
    chatHistory.push(botMessage);

    saveHistory();

    document.getElementById("loading").remove();
    chatWindow.innerHTML += `<div class="bot-message"><b>Bot:</b> ${botReply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.addEventListener('DOMContentLoaded', loadHistory);