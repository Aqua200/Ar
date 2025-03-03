let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i;

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat];
    let bot = global.db.data.settings[this.user.jid] || {};
    const isGroupLink = linkRegex.exec(m.text);
    const grupo = `https://chat.whatsapp.com`;

    if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
        return conn.reply(m.chat, `🏷 *Hey!! El anti-link está activo, pero eres admin. ¡Salvado!*`, m);
    }

    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (!isBotAdmin) {
            return conn.reply(m.chat, `🌼 *No soy admin, no puedo eliminar intrusos*`, m);
        }

        const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
        if (m.text.includes(linkThisGroup)) return true;

        // **Expulsar al usuario antes de enviar cualquier mensaje**
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

        // **Eliminar el mensaje**
        await conn.sendMessage(m.chat, { delete: m.key });

        // **Enviar advertencia después de la expulsión**
        await conn.reply(m.chat, `📎 *¡Enlace detectado y usuario eliminado!*\n\n*${await this.getName(m.sender)} envió un enlace prohibido y ha sido expulsado.*`, m);

        return false;
    }

    return true;
}
