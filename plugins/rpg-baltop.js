let handler = async (m, { conn, args, participants }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
        ...value,
        jid: key,
        dulces: value.dulces || 0 // Asegurar que siempre tenga un valor
    }));

    // Ordenar por la cantidad de dulces
    let sortedLim = users.sort((a, b) => b.dulces - a.dulces);

    let len = args[0] && !isNaN(args[0]) ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedLim.length);

    let emoji = '🍬'; // Emoji de dulces
    let moneda = 'Dulces';

    let text = `「${emoji}」Los usuarios con más *${moneda}* son:\n\n`;

    text += sortedLim.slice(0, len).map(({ jid, dulces }, i) => {
        let nombre = conn.getName(jid) || "Usuario desconocido";
        let mention = participants.some(p => p.jid === jid) ? `(${nombre}) wa.me/${jid.split`@`[0]}` : `@${jid.split`@`[0]}`;
        return `✰ ${i + 1} » *${mention}:*` +
               `\n\t\t Total→ *${dulces} ${moneda}*`;
    }).join('\n');

    await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });
}

handler.help = ['baltop'];
handler.tags = ['rpg'];
handler.command = ['baltop', 'eboard'];
handler.group = true;
handler.register = true;

export default handler;
