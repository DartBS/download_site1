import os
import json
import logging
from flask import Flask, request
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)

# =====================================================================
# ⚙️ AYARLAR VE SABİTLER
# =====================================================================
TOKEN = "8401229165:AAExFyLutWCQwZ9fggFKKZpABiFUjfF2RKw"
ADMIN_ID = 5795527414

# PythonAnywhere üzerindeki dosya yolları (Bulunduğu dizinde oluşturulur)
SETTINGS_FILE = "settings.txt"
USERS_FILE = "users.txt"

DEFAULT_SETTINGS = {
    "sub_code": "https://raw.githubusercontent.com/DartBS/Telegram-bot/refs/heads/main/Subs.txt",
    "channels": [
        {"id": "@lenoxstore", "name": "LENOX STORE 🇹🇲", "url": "https://t.me/lenoxstore"},
        {"id": "@gereklikanal", "name": "Gerekli Kanal", "url": "https://t.me/gereklikanal"}
    ]
}

# 📁 AYARLARI YÜKLE / KAYDET
def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_SETTINGS, f, ensure_ascii=False, indent=4)
        return DEFAULT_SETTINGS
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return DEFAULT_SETTINGS

def save_settings(data):
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# 👥 KULLANICI İŞLEMLERİ
def save_user(user_id):
    if not os.path.exists(USERS_FILE):
        open(USERS_FILE, "w", encoding="utf-8").close()
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        users = f.read().splitlines()
    if str(user_id) not in users:
        with open(USERS_FILE, "a", encoding="utf-8") as f:
            f.write(f"{user_id}\n")

def get_user_count():
    if not os.path.exists(USERS_FILE):
        return 0
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return len(f.read().splitlines())

# ⌨️ KLAVYELER
def get_user_keyboard():
    settings = load_settings()
    keyboard = []
    row = []

    for channel in settings.get("channels", []):
        btn = InlineKeyboardButton(
            text=channel["name"],
            url=channel["url"],
            api_kwargs={"style": "primary"}
        )
        row.append(btn)
        if len(row) == 2:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)

    btn_check = InlineKeyboardButton(
        text="✅ Kanala Ağza Boldym!",
        callback_data="check_sub",
        api_kwargs={"style": "success"}
    )
    keyboard.append([btn_check])
    return InlineKeyboardMarkup(keyboard)

def get_admin_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="Subscription Kod'u Değiştir👨‍💻", callback_data="admin_change_sub"),
            InlineKeyboardButton(text="Kanal Ekle📣", callback_data="admin_add_channel")
        ],
        [
            InlineKeyboardButton(text="Kanal Sil➖", callback_data="admin_delete_channel"),
            InlineKeyboardButton(text="Kullanıcı Sayısı👥", callback_data="admin_show_count")
        ],
        [
            InlineKeyboardButton(text="Bütün Kullanıcılara Haber Ver📣", callback_data="admin_broadcast_trigger")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

# 🔍 ABONELİK KONTROL
async def get_missing_channels(bot, user_id):
    settings = load_settings()
    missing = []
    for channel in settings.get("channels", []):
        try:
            member = await bot.get_chat_member(chat_id=channel["id"], user_id=user_id)
            if member.status not in ["creator", "administrator", "member"]:
                missing.append(channel["name"])
        except Exception:
            missing.append(channel["name"])
    return missing

# 🚀 HANDLER'LAR
async def start_command(update: Update, context):
    save_user(update.effective_user.id)
    welcome_text = (
        "Salam, Men @lenoxstore'en Bot'y!👋\n\n"
        "Aşakdaky Kanallara Ağza Bolup Kodu Alyň!\n\n"
        "<blockquote>Bot'a Kanal Alyan❗Yaz: <a href='https://t.me/Lenoxbest7'>Lenox 🥝</a></blockquote>\n\n"
        "❗Subscription Link İşlemese Vpn Bilen Barlaň!"
    )
    await update.message.reply_text(
        text=welcome_text,
        reply_markup=get_user_keyboard(),
        parse_mode="HTML",
        disable_web_page_preview=True
    )

async def admin_command(update: Update, context):
    if update.effective_user.id != ADMIN_ID:
        return
    await update.message.reply_text(
        "<b>👑 VpnFreeDrop Yönetici Paneli</b>\n\nYapmak istediğiniz işlemi aşağıdaki butonlardan seçin kanka:",
        reply_markup=get_admin_keyboard(),
        parse_mode="HTML"
    )

async def callback_handler(update: Update, context):
    query = update.callback_query
    await query.answer()
    user_id = query.from_user.id
    data = query.data
    settings = load_settings()

    if data == "check_sub":
        missing_channels = await get_missing_channels(context.bot, user_id)
        if not missing_channels:
            success_text = (
                "Şartlary berjaý edeniňiz üçin sag boluň! VPN Subscription koduňyz:\n\n"
                f"<pre>{settings['sub_code']}</pre>\n\n"
                "👆 Üstüne basyp kopyalap bilersiňiz!"
            )
            await query.message.reply_text(success_text, parse_mode="HTML")
        else:
            channels_text = "\n".join([f"• {name}" for name in missing_channels])
            alert_text = f"Siz ähli kanallara ağza bolmadyňyz😮\n{channels_text}"
            await query.message.reply_text(alert_text, parse_mode="HTML")

    elif data == "admin_show_count":
        if user_id != ADMIN_ID: return
        total_users = get_user_count()
        await query.message.reply_text(f"👥 <b>Güncel Kullanıcı Sayısı:</b> {total_users} kişi botu başlattı.", parse_mode="HTML")

    elif data == "admin_change_sub":
        if user_id != ADMIN_ID: return
        context.user_data["admin_state"] = "waiting_sub"
        await query.message.reply_text("📝 Kanka, yeni VPN Subscription kodunu yazıp gönder:")

    elif data == "admin_add_channel":
        if user_id != ADMIN_ID: return
        context.user_data["admin_state"] = "waiting_channel"
        instruction = (
            "📣 <b>Yeni Kanal Ekleme Formatı</b>\n\n"
            "Format: <code>KanalID, KanalAdı, KanalLinki</code>\n\n"
            "<b>Örnek:</b>\n"
            "<code>@testkanal, Test Kanalı 🔥, https://t.me/testkanal</code>"
        )
        await query.message.reply_text(instruction, parse_mode="HTML")

    elif data == "admin_delete_channel":
        if user_id != ADMIN_ID: return
        channels = settings.get("channels", [])
        if not channels:
            await query.message.reply_text("❌ Silinecek kanal bulunamadı kanka!")
            return
        list_msg = "<b>➖ Silmek istediğin kanalın numarasını yazıp gönder kanka:</b>\n\n"
        for idx, ch in enumerate(channels, 1):
            list_msg += f"<b>{idx}.</b> {ch['name']} ({ch['id']})\n"
        context.user_data["admin_state"] = "waiting_delete_channel"
        await query.message.reply_text(list_msg, parse_mode="HTML")

    elif data == "admin_broadcast_trigger":
        if user_id != ADMIN_ID: return
        context.user_data["admin_state"] = "waiting_broadcast"
        await query.message.reply_text("📝 Kanka, nahili Habar bul? Gönderilecek mesajı yazıp yolla:")

    elif data == "admin_send_broadcast":
        if user_id != ADMIN_ID: return
        msg_to_send = context.user_data.get("broadcast_msg")
        if not msg_to_send or not os.path.exists(USERS_FILE):
            await query.message.reply_text("❌ Mesaj veya kayıtlı kullanıcı bulunamadı!")
            return

        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = f.read().splitlines()

        await query.message.reply_text(f"🚀 Toplam {len(users)} kullanıcıya mesaj gönderimi başlatıldı...")
        success_count = 0
        for u_id in users:
            try:
                await context.bot.send_message(chat_id=int(u_id), text=msg_to_send, parse_mode="HTML")
                success_count += 1
            except Exception:
                pass

        await query.message.reply_text(f"✅ Mesaj gönderimi tamamlandı!\nBaşarılı: {success_count}/{len(users)}")
        context.user_data.pop("broadcast_msg", None)

async def message_handler(update: Update, context):
    user_id = update.effective_user.id
    if user_id != ADMIN_ID:
        return

    state = context.user_data.get("admin_state")
    text = update.message.text.strip()

    if state == "waiting_sub":
        settings = load_settings()
        settings["sub_code"] = text
        save_settings(settings)
        context.user_data["admin_state"] = None
        await update.message.reply_text("✅ <b>Subscription kodu başarıyla güncellendi kanka!</b>", parse_mode="HTML")

    elif state == "waiting_channel":
        try:
            parts = [p.strip() for p in text.split(",")]
            if len(parts) < 3:
                await update.message.reply_text("❌ Eksik bilgi girdin. Format: <code>KanalID, KanalAdı, KanalLinki</code>", parse_mode="HTML")
                return
            c_id, c_name, c_url = parts[0], parts[1], parts[2]
            settings = load_settings()
            if "channels" not in settings:
                settings["channels"] = []
            settings["channels"].append({"id": c_id, "name": c_name, "url": c_url})
            save_settings(settings)
            context.user_data["admin_state"] = None
            await update.message.reply_text(f"✅ <b>{c_name}</b> listeye eklendi kanka!", parse_mode="HTML")
        except Exception as e:
            await update.message.reply_text(f"❌ Hata: {str(e)}")

    elif state == "waiting_delete_channel":
        try:
            ch_index = int(text) - 1
            settings = load_settings()
            channels = settings.get("channels", [])
            if 0 <= ch_index < len(channels):
                removed = channels.pop(ch_index)
                settings["channels"] = channels
                save_settings(settings)
                context.user_data["admin_state"] = None
                await update.message.reply_text(f"✅ <b>{removed['name']}</b> kanalı başarıyla silindi!", parse_mode="HTML")
            else:
                await update.message.reply_text("❌ Geçersiz numara girdin kanka, tekrar dene.")
        except ValueError:
            await update.message.reply_text("❌ Lütfen sadece sayı gir kanka!")

    elif state == "waiting_broadcast":
        context.user_data["broadcast_msg"] = text
        context.user_data["admin_state"] = None
        btn_send = InlineKeyboardButton(text="Ugrat 🚀", callback_data="admin_send_broadcast")
        markup = InlineKeyboardMarkup([[btn_send]])
        await update.message.reply_text(
            f"<b>Hazırlanan Mesaj Önizlemesi:</b>\n\n{text}\n\n⚠️ Herkese göndermek için basın:",
            reply_markup=markup,
            parse_mode="HTML"
        )

# =====================================================================
# 🌐 FLASK VE WEBHOOK APPLIKASYON YAPILANDIRMASI
# =====================================================================
app = Flask(__name__)

# Telegram Application başlatma
telegram_app = Application.builder().token(TOKEN).build()

telegram_app.add_handler(CommandHandler("start", start_command))
telegram_app.add_handler(CommandHandler(["admin", "ulanyjylara"], admin_command))
telegram_app.add_handler(CallbackQueryHandler(callback_handler))
telegram_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

# Async başlatma bayrağı
is_initialized = False

@app.route(f"/{TOKEN}", methods=["POST"])
async def webhook():
    global is_initialized
    if not is_initialized:
    await telegram_app.initialize()
    is_initialized = True

    if request.method == "POST":
        data = request.get_json(force=True)
        update = Update.de_json(data, telegram_app.bot)
        await telegram_app.process_update(update)
        return "OK", 200

@app.route("/", methods=["GET"])
def index():
    return "Bot Aktif ve Çalışıyor!", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
