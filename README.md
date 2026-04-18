# Jotform Frontend Challenge Project

## User Information

- **Name**: İsmail Yağız Güven

## Project Description
Ankara Case is a React + Vite application built for the Jotform Frontend Hackathon. It concurrently fetches data from 5 different Jotform endpoints (check-ins, tips, messages, sightings, and notes), normalizes their disparate data structures into a single unified chronological timeline, and provides real-time search filtering. The UI is built using pure Vanilla CSS featuring a premium dark-mode, glassmorphic aesthetic, and handles API rate limits gracefully via a mock data fallback.

## 🚀 Kurulum ve Çalıştırma (How to Run)

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1.  **Bağımlılıkları Yükleyin:** Terminalde proje dizinine gidin ve paketleri yüklemek için şu komutu çalıştırın:
    ```bash
    npm install
    ```
2.  **Environment Variables (.env) Ayarları:** Proje kök dizininde bir `.env` dosyası oluşturun (veya `.env.example` varsa kopyalayın) ve gerekli Jotform API anahtarlarınızı ve Form ID'lerinizi tanımlayın:
    ```env
    VITE_JOTFORM_API_KEY=YOUR_API_KEY
    VITE_FORM_CHECKINS=FORM_ID_1
    VITE_FORM_MESSAGES=FORM_ID_2
    VITE_FORM_SIGHTINGS=FORM_ID_3
    VITE_FORM_NOTES=FORM_ID_4
    VITE_FORM_TIPS=FORM_ID_5
    ```
3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
4.  **Tarayıcıda Görüntüleyin:** Tarayıcınızı açın ve `http://localhost:5173` adresine gidin.

---

## 🛠️ Getting Started (English)
1. Install dependencies by running `npm install`.
2. Create a `.env` file in the root directory and add your `VITE_JOTFORM_API_KEY` along with the specific Form IDs for the investigation.
3. Start the development server with `npm run dev`.
4. Open your browser and navigate to `http://localhost:5173`.

# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler