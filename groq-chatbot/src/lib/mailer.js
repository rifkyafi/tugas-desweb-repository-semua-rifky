import nodemailer from 'nodemailer';
import pool from '@/lib/db';

// ─── Transporter ────────────────────────────────────────────────────────────

// Buat koneksi ke Gmail SMTP menggunakan kredensial dari .env.local
let transporter = createTransporter();

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ─── Helper: Strip HTML ──────────────────────────────────────────────────────

// Mengubah konten HTML menjadi teks biasa (plain text)
// Digunakan sebagai fallback untuk email client yang tidak support HTML
function htmlToPlainText(html) {
  const withoutTags   = html.replace(/<[^>]+>/g, ''); // hapus semua tag HTML
  const singleSpaced  = withoutTags.replace(/\s+/g, ' '); // gabungkan spasi ganda
  const trimmed       = singleSpaced.trim(); // hapus spasi di awal dan akhir
  return trimmed;
}

// ─── Helper: Build Mail Options ──────────────────────────────────────────────

// Membuat objek konfigurasi email yang siap dikirim
function buildMailOptions(targetEmail, subject, html) {
  const plainText = htmlToPlainText(html);

  return {
    from:     `"GroqChat" <${process.env.EMAIL_USER}>`,
    replyTo:  process.env.EMAIL_USER,
    to:       targetEmail,
    subject,
    html,
    text:     plainText,
    headers: {
      // Wajib ada agar tidak dianggap spam oleh Gmail/Outlook
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
      'X-Mailer':         'GroqChat Mailer',
      'X-Priority':       '3',
    },
  };
}

// ─── Helper: Send With Retry ─────────────────────────────────────────────────

// Mengirim email dengan percobaan ulang jika gagal
// Jeda antar percobaan: 2 detik → 5 detik → 15 detik
const RETRY_DELAYS_MS = [2000, 5000, 15000];

async function sendWithRetry(mailOpts, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOpts);
      return { success: true, info };
    } catch (error) {
      lastError = error;
      console.error(`[Mailer] Percobaan ${attempt}/${maxRetries} gagal:`, error.message);

      // Jika error koneksi, buat ulang transporter
      const isConnectionError = (
        error.code === 'EAUTH' ||
        error.code === 'ECONNECTION' ||
        error.code === 'ETIMEDOUT'
      );
      if (isConnectionError) {
        transporter = createTransporter();
      }

      // Tunggu sebelum percobaan berikutnya (kecuali percobaan terakhir)
      const isLastAttempt = attempt === maxRetries;
      if (!isLastAttempt) {
        const delayMs = RETRY_DELAYS_MS[attempt - 1];
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return { success: false, error: lastError };
}

// ─── Helper: Save to Queue ───────────────────────────────────────────────────

// Menyimpan email yang gagal ke database untuk dicoba kembali nanti
async function saveToQueue(type, targetEmail, userName, provider) {
  try {
    await pool.execute(
      `INSERT INTO email_queue (type, target_email, user_name, provider, status, next_attempt_at)
       VALUES (?, ?, ?, ?, 'pending', DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
      [type, targetEmail, userName || null, provider || null]
    );
    console.log(`[Mailer] Email di-queue untuk ${targetEmail}`);
  } catch (err) {
    console.error('[Mailer] Gagal insert queue:', err.message);
  }
}

// ─── Helper: Format Login Method ─────────────────────────────────────────────

// Mengubah nama provider menjadi label yang lebih mudah dibaca
function formatLoginMethod(provider) {
  if (provider === 'credentials') return 'Email & Password';
  if (provider === 'google')      return 'Google';
  if (provider === 'github')      return 'GitHub';
  return provider;
}

// ─── Helper: Format Date ─────────────────────────────────────────────────────

// Mengformat tanggal ke format Indonesia, contoh: "26 Juli 2025, 18:00"
function formatDateIndonesia(date) {
  return date.toLocaleString('id-ID', {
    timeZone:  'Asia/Jakarta',
    day:       'numeric',
    month:     'long',
    year:      'numeric',
    hour:      '2-digit',
    minute:    '2-digit',
  });
}

// ─── Public: Send Welcome Email ──────────────────────────────────────────────

// Dikirim saat pengguna berhasil membuat akun baru
export async function sendWelcomeEmail(targetEmail, userName) {
  const displayName = userName || 'Pengguna';

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #10b981;">Halo, ${displayName}! 👋</h2>
      <p>Terima kasih telah mendaftar di <strong>GroqChat</strong>.</p>
      <p>Akun kamu sekarang sudah aktif dan siap digunakan.</p>
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; margin: 20px 0; border-radius: 4px;">
        <strong>Mulai chat sekarang!</strong><br/>
        Login dan mulai percakapan dengan AI.
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <small style="color: #888;">Pesan ini dikirim secara otomatis oleh GroqChat.</small>
    </div>
  `;

  const mailOpts = buildMailOptions(targetEmail, 'Selamat Datang di GroqChat', html);
  const result   = await sendWithRetry(mailOpts);

  if (result.success) {
    console.log('[Mailer] Welcome email terkirim. ID:', result.info.messageId);
    return { success: true };
  }

  // Jika gagal setelah semua percobaan, simpan ke queue untuk dicoba lagi nanti
  console.error('[Mailer] Welcome email gagal setelah retry:', result.error.message);
  await saveToQueue('welcome', targetEmail, displayName, null);
  return { success: false, error: result.error.message };
}

// ─── Public: Send Login Notification ─────────────────────────────────────────

// Dikirim setiap kali pengguna berhasil login
export async function sendLoginNotification(targetEmail, userName, provider) {
  const displayName  = userName || 'Pengguna';
  const loginTime    = formatDateIndonesia(new Date());
  const loginMethod  = formatLoginMethod(provider);

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #3b82f6;">Halo, ${displayName}! 🔐</h2>
      <p>Akun kamu baru saja login ke <strong>GroqChat</strong>.</p>
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0; border-radius: 4px;">
        <strong>Detail Login:</strong><br/>
        <span style="color: #555;">Waktu:</span> ${loginTime} WIB<br/>
        <span style="color: #555;">Metode:</span> ${loginMethod}
      </div>
      <p style="color: #ef4444; font-size: 13px;">⚠️ Jika ini bukan kamu, segera ubah password akun kamu.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <small style="color: #888;">Pesan ini dikirim secara otomatis oleh GroqChat.</small>
    </div>
  `;

  const mailOpts = buildMailOptions(targetEmail, 'Notifikasi Login - GroqChat', html);
  const result   = await sendWithRetry(mailOpts);

  if (result.success) {
    console.log('[Mailer] Login notification terkirim. ID:', result.info.messageId);
    return { success: true };
  }

  // Jika gagal setelah semua percobaan, simpan ke queue untuk dicoba lagi nanti
  console.error('[Mailer] Login notification gagal setelah retry:', result.error.message);
  await saveToQueue('login_notification', targetEmail, displayName, provider);
  return { success: false, error: result.error.message };
}

// ─── Public: Send Direct (untuk queue processor) ─────────────────────────────

// Digunakan oleh queue processor untuk mengirim ulang email yang gagal
export async function sendDirect(mailOpts) {
  return await sendWithRetry(mailOpts, 2);
}