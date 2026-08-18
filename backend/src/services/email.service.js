
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmailPrazo({ destinatario, nomeUsuario, tarefaTitulo, mensagem }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada - e-mail não enviado (apenas registrado no banco).');
    return null;
  }

  try {
    const resultado = await resend.emails.send({
      from: 'TaskAI <onboarding@resend.dev>',
      to: destinatario,
      subject: `TaskAI · ${tarefaTitulo}`,
      html: `
        <div style="font-family: sans-serif; color: #20323C;">
          <p>Olá, ${nomeUsuario}!</p>
          <p>${mensagem}</p>
          <p style="color:#5B6B72; font-size: 12px;">Este é um aviso automático do TaskAI.</p>
        </div>
      `,
    });
    return resultado;
  } catch (erro) {
    console.error('Falha ao enviar e-mail via Resend:', erro.message);
    return null;
  }
}

module.exports = { enviarEmailPrazo };