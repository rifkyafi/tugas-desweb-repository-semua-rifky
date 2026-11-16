import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendDirect } from "@/lib/mailer";

const WELCOME_SUBJECT = 'Selamat Datang di GroqChat! 🎉';
const LOGIN_SUBJECT = 'Notifikasi Login - GroqChat 🔐';

function welcomeHtml(name) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #10b981;">Halo, ${name || 'Pengguna'}! 👋</h2>
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
}

function loginHtml(name, method) {
  const now = new Date();
  const waktu = now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto;">
      <h2 style="color: #3b82f6;">Halo, ${name || 'Pengguna'}! 🔐</h2>
      <p>Akun kamu baru saja login ke <strong>GroqChat</strong>.</p>
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0; border-radius: 4px;">
        <strong>Detail Login:</strong><br/>
        <span style="color: #555;">Waktu:</span> ${waktu} WIB<br/>
        <span style="color: #555;">Metode:</span> ${method}
      </div>
      <p style="color: #ef4444; font-size: 13px;">⚠️ Jika ini bukan kamu, segera ubah password akun kamu.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <small style="color: #888;">Pesan ini dikirim secara otomatis oleh GroqChat.</small>
    </div>
  `;
}

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM email_queue
       WHERE status = 'pending'
         AND (next_attempt_at IS NULL OR next_attempt_at <= NOW())
       ORDER BY created_at ASC
       LIMIT 10`
    );

    const results = [];

    for (const row of rows) {
      await pool.execute(
        "UPDATE email_queue SET status = 'processing' WHERE id = ?",
        [row.id]
      );

      let subject, body;
      if (row.type === 'welcome') {
        subject = WELCOME_SUBJECT;
        body = welcomeHtml(row.user_name);
      } else {
        subject = LOGIN_SUBJECT;
        body = loginHtml(row.user_name, row.provider);
      }

      const mailOpts = {
        from: `"GroqChat" <${process.env.EMAIL_USER}>`,
        to: row.target_email,
        subject,
        html: body,
      };

      const result = await sendDirect(mailOpts);

      if (result.success) {
        await pool.execute(
          "UPDATE email_queue SET status = 'sent', updated_at = NOW() WHERE id = ?",
          [row.id]
        );
        results.push({ id: row.id, status: 'sent' });
      } else {
        const newRetry = row.retry_count + 1;
        if (newRetry >= (row.max_retries || 3)) {
          await pool.execute(
            "UPDATE email_queue SET status = 'failed', retry_count = ?, last_error = ?, updated_at = NOW() WHERE id = ?",
            [newRetry, result.error, row.id]
          );
          results.push({ id: row.id, status: 'failed' });
        } else {
          const backoff = Math.pow(2, newRetry) * 60;
          await pool.execute(
            `UPDATE email_queue SET status = 'pending', retry_count = ?, last_error = ?, next_attempt_at = DATE_ADD(NOW(), INTERVAL ? SECOND), updated_at = NOW() WHERE id = ?`,
            [newRetry, result.error, backoff, row.id]
          );
          results.push({ id: row.id, status: 'retry', nextAttempt: `${backoff}s` });
        }
      }
    }

    return NextResponse.json({ processed: rows.length, results });
  } catch (error) {
    console.error('[QueueProcessor] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}