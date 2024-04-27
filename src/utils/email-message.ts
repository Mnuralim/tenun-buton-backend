const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

export const successRegister = (password?: string, isGoogle?: boolean) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pendaftaran Berhasil</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Pendaftaran Berhasil</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Selamat! Pendaftaran anda berhasil . Anda sekarang dapat menggunakan layanan kami.</p>
                           ${
                             isGoogle && password
                               ? ` <p>password anda adalah : ${password}.</p>
                            <p>Mohon simpan password anda dengan baik.</p>`
                               : ''
                           }
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2024 tenunbuton.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `
}

export const verifyEmailMessage = (token: string) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifikasi Email Anda</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Verifikasi Email Anda</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Terima kasih telah mendaftar di tenunbuton.com. Untuk menyelesaikan proses pendaftaran, silakan klik tombol di bawah ini</p>
                            <a href="${CLIENT_URL}/auth/verify-email/${token}" style="font-size: 24px; font-weight: bold; color: #333;">Verifikasi Email</a>
                            <p>Jika Anda tidak merasa mendaftar di situs kami, Anda bisa mengabaikan pesan ini.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2024 tenunbuton.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

`
}

export const forgotPasswordMessage = (passwordResetToken: string) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lupa Kata Sandi</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Lupa Kata Sandi</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Kami menerima permintaan Anda untuk mereset kata sandi. Untuk melanjutkan proses reset kata sandi, silakan klik tombol di bawah ini:</p>
                            <p>
                                <a href="${CLIENT_URL}/auth/reset-password/${passwordResetToken}" style="background-color: #007BFF; color: #ffffff; text-align: center; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Kata Sandi</a>
                            </p>
                            <p>Jika Anda tidak meminta reset kata sandi, Anda bisa mengabaikan pesan ini. Keamanan akun Anda tetap terjaga.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2024 tenunbuton.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
}

export const resetPasswordMsgSuccess = () => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Kata Sandi Berhasil</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#f4f4f4">
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <h1>Reset Kata Sandi Berhasil</h1>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 5px;">
                            <p>Kata sandi akun Anda telah berhasil direset. Anda sekarang dapat masuk dengan kata sandi baru.</p>
                            <p>Jika Anda merasa ini bukan tindakan Anda, segera hubungi kami.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" style="text-align: center; padding: 20px 0;">
                            &copy; 2024 tenunbuton.com
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `
}
