let handler = async (m, { conn, args, participants }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
        ...value,
        jid: key
    }));

    // Ordenar por la cantidad de dulces
    let sortedLim = users.sort((a, b) => (b.dulces || 0) - (a.dulces || 0));

    let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedLim.length);

    let emoji = '🍬'; // Emoji de dulces
    let moneda = 'Dulces';

    let text = `「${emoji}」Los usuarios con más *${moneda}* son:\n\n`;

    text += sortedLim.slice(0, len).map(({ jid, dulces }, i) => {
        return `✰ ${i + 1} » *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}:*` +
               `\n\t\t Total→ *${dulces || 0} ${moneda}*`;
    }).join('\n');

    await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });
}

handler.help = ['baltop'];
handler.tags = ['rpg'];
handler.command = ['baltop', 'eboard'];
handler.group = true;
handler.register = true;

export default handler;
