let handler = async (m, { conn, args }) => {
  try {
    let id = args?.[0]?.match(/\d+\-\d+@g.us/)?.[0] || m.chat;

    const participantesUnicos = [
      ...new Set(
        Object.values(conn.chats[id]?.messages || {})
          .map((item) => item.key?.participant)
          .filter((k) => k && k.includes("@"))
      ),
    ]; // Filtra valores válidos y elimina duplicados

    const listaEnLinea =
      participantesUnicos.length > 0
        ? participantesUnicos.map((k) => `💗 @${k.split("@")[0]} `).join("\n")
        : "🏯 *No hay nadie en línea por ahora.* 🏯";

    const mensaje = `╭───────────────✿  
│ 🎐 *Usuarios en Línea* 🎐  
├───────────────✿  
${listaEnLinea}  
├───────────────✿  
│ 🍁 *Ｈａｋａｒｉ ここにいる。* 🍁  
╰───────────────✿`;

    await conn.sendMessage(m.chat, {
      text: mensaje,
      mentions: participantesUnicos,
    });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    await m.reply("⛩️ Hubo un error al enviar la lista de usuarios.");
  }
};

handler.help = ["listonline"];
handler.tags = ["grupo"];
handler.command = ["listonline", "online", "linea", "enlinea"];
handler.group = true;
handler.fail = null;
handler.register = true;

export default handler;
